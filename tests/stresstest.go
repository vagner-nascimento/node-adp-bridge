package main

import (
	"errors"
	"fmt"
	"io/ioutil"
	"os"
	"strconv"
	"strings"
	"sync"

	"github.com/streadway/amqp"
)

var (
	qtdSellers   int
	qtdMerchants int
)

/*
	TODO: not all msgs are published. Error:
	channel closed Exception (505) Reason: "UNEXPECTED_FRAME - expected content body, got non content body frame instead"
*/
func main() {
	setTestParams()
	publishMessages()
}

func setTestParams() {
	// default params
	qtdSellers = 200
	qtdMerchants = 200

	// env params
	if qtd := os.Getenv("QTD_SELL"); len(qtd) > 0 {
		qtdSellers, _ = strconv.Atoi(qtd)
	}
	if qtd := os.Getenv("QTD_MERCH"); len(qtd) > 0 {
		qtdMerchants, _ = strconv.Atoi(qtd)
	}
}

func publishMessages() {
	errs := multiplexErrors(
		pubMerchants(qtdMerchants),
		pubSellers(qtdSellers),
	)

	for err := range errs {
		if err != nil {
			fmt.Println("pub err", err)
		}
	}

	fmt.Println(fmt.Sprintf("all %d messages were published", qtdMerchants+qtdSellers))
}

// AMQP
type connection struct {
	conn    *amqp.Connection
	ch      *amqp.Channel
	connect sync.Once
	isAlive bool
}

var singletonConn connection

func getChannel() *amqp.Channel {
	var (
		err error
	)

	if singletonConn.conn == nil || singletonConn.conn.IsClosed() {
		singletonConn.ch = nil

		var url string
		if strings.ToUpper(os.Getenv("GO_ENV")) == "DOCKER" {
			url = "amqp://guest:guest@js-rabbit-mq:5672"
		} else {
			url = "amqp://guest:guest@localhost:5672"
		}

		singletonConn.conn, err = amqp.Dial(url)
	}

	if err != nil {
		fmt.Println("error on connect into rabbit mq")
		panic(err)
	}

	if singletonConn.ch == nil {
		if singletonConn.ch, err = singletonConn.conn.Channel(); err == nil {
			chErrs := singletonConn.ch.NotifyClose(make(chan *amqp.Error))

			go func() {
				for chErr := range chErrs {
					fmt.Println("channel closed", chErr)

					singletonConn.ch = nil
				}
			}()
		} else {
			fmt.Println("error on create a channel")
			panic(err)
		}
	}

	return singletonConn.ch
}

func publishMsg(data []byte, topic string) error {
	var (
		ch  *amqp.Channel
		qP  amqp.Queue
		err error
	)

	ch = getChannel()

	for ch == nil {
		fmt.Println("channel null, trying to get other")

		ch = getChannel()
	}

	qP, err = ch.QueueDeclare(
		topic,
		false,
		false,
		false,
		false,
		nil,
	)

	if err == nil {
		err = ch.Publish(
			"",
			qP.Name,
			false,
			false,
			amqp.Publishing{
				ContentType: "application/json",
				Body:        data,
			},
		)
	}

	return err
}

func pubMerchants(qtd int) <-chan error {
	errs := make(chan error)

	go func() {
		json, err := os.Open("./support/mocks/merchant.json")
		if err == nil {
			defer json.Close()

			if data, err := ioutil.ReadAll(json); err == nil {
				for i := 1; i <= qtd; i++ {
					fmt.Println(fmt.Sprintf("publishing merchant %d of %d", i, qtd))
					err := publishMsg(data, "q-merchants")
					for err != nil {
						errs <- errors.New("q-merchants err: " + err.Error())

						err = publishMsg(data, "q-merchants")
					}
				}
			}
		} else {
			errs <- err
		}

		close(errs)
	}()

	return errs
}

func pubSellers(qtd int) <-chan error {
	errs := make(chan error)

	go func() {
		json, err := os.Open("./support/mocks/seller.json")
		if err == nil {
			defer json.Close()

			fmt.Println("file seller.json successfully opened")

			if data, err := ioutil.ReadAll(json); err == nil {
				for i := 1; i <= qtd; i++ {
					fmt.Println(fmt.Sprintf("publishing seller %d of %d", i, qtd))
					err := publishMsg(data, "q-sellers")
					for err != nil {
						errs <- errors.New("q-sellers err: " + err.Error())

						err = publishMsg(data, "q-sellers")
					}
				}
			}
		} else {
			errs <- err
		}

		close(errs)
	}()

	return errs
}

// Channel multiplexer
func multiplexErrors(errsCh ...<-chan error) <-chan error {
	uniqueCh := make(chan error)

	go func(ch *chan error, errs []<-chan error) {
		totalChannels := len(errs)
		var closedChannels int

		for _, errCh := range errsCh {
			go forwardError(errCh, uniqueCh, &closedChannels)
		}

		for {
			if totalChannels == closedChannels {
				break
			}
		}

		close(*ch)
	}(&uniqueCh, errsCh)

	return uniqueCh
}

func forwardError(from <-chan error, to chan error, closedChannels *int) {
	for err := range from {
		to <- err
	}

	*closedChannels++
}
