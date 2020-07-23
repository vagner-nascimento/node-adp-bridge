package main
/*
errors on node app:

2020-07-20 07:04:40.827Z - error on to publish data into q-accounts  Error: No channels left to allocate
    at Connection.C.freshChannel (/app/node_modules/amqplib/lib/connection.js:451:11)
    at Channel.C.allocate (/app/node_modules/amqplib/lib/channel.js:53:29)
    at tryCatcher (/app/node_modules/bluebird/js/release/util.js:16:23)
    at Function.Promise.attempt.Promise.try (/app/node_modules/bluebird/js/release/method.js:39:29)
    at Channel.C.open (/app/node_modules/amqplib/lib/channel_model.js:68:21)
    at ChannelModel.CM.createChannel (/app/node_modules/amqplib/lib/channel_model.js:48:12)
    at RabbitServer.<anonymous> (/app/dist/infra/data/amqp/RabbitServer.js:82:47)
    at Generator.next (<anonymous>)
    at /app/dist/infra/data/amqp/RabbitServer.js:8:71
    at new Promise (<anonymous>)
    at __awaiter (/app/dist/infra/data/amqp/RabbitServer.js:4:12)
    at RabbitServer.newChannel (/app/dist/infra/data/amqp/RabbitServer.js:76:16)
    at RabbitServer.<anonymous> (/app/dist/infra/data/amqp/RabbitServer.js:104:39)
    at Generator.next (<anonymous>)
    at /app/dist/infra/data/amqp/RabbitServer.js:8:71
    at new Promise (<anonymous>)
2020-07-20 07:04:40.827Z - error on to publish data into q-accounts  Error: No channels left to allocate
    at Connection.C.freshChannel (/app/node_modules/amqplib/lib/connection.js:451:11)
    at Channel.C.allocate (/app/node_modules/amqplib/lib/channel.js:53:29)
    at tryCatcher (/app/node_modules/bluebird/js/release/util.js:16:23)
    at Function.Promise.attempt.Promise.try (/app/node_modules/bluebird/js/release/method.js:39:29)
    at Channel.C.open (/app/node_modules/amqplib/lib/channel_model.js:68:21)
    at ChannelModel.CM.createChannel (/app/node_modules/amqplib/lib/channel_mevents.js:174
      throw er; // Unhandled 'error' event
      ^

Error: write EPIPE
    at WriteWrap.afterWrite [as oncomplete] (net.js:788:14)
Emitted 'error' event at:
    at Connection.emit (events.js:203:15)
    at Connection.C.onSocketError (/app/node_modules/amqplib/lib/connection.js:353:10)
    at Socket.emit (events.js:203:15)
    at errorOrDestroy (internal/streams/destroy.js:107:12)
    at onwriteError (_stream_writable.js:436:5)
    at onwrite (_stream_writable.js:461:5)
    at _destroy (internal/streams/destroy.js:49:7)
    at Socket._destroy (net.js:613:3)
    at Socket.destroy (internal/streams/destroy.js:37:8)
    at WriteWrap.afterWrite [as oncomplete] (net.js:790:10)
vagner@vnasc-note-sam:~$

*/
import (
	"errors"
	"fmt"
	"github.com/streadway/amqp"
	"io/ioutil"
	"os"
	"strconv"
	"strings"
	"sync"
	"time"
)

func main() {
	setTestParams()
	runWithoutConsume()
	//runWithConsume()
}

var (
	qtdSellers   int
	qtdMerchants int
	testTimeOut  time.Duration
)

func setTestParams() {
	// default params
	qtdSellers = 800
	qtdMerchants = 800
	minutes := 10

	// env params
	if qtd := os.Getenv("QTD_SELL"); len(qtd) > 0 {
		qtdSellers, _ = strconv.Atoi(qtd)
	}
	if qtd := os.Getenv("QTD_MERCH"); len(qtd) > 0 {
		qtdMerchants, _ = strconv.Atoi(qtd)
	}
	if t := os.Getenv("MINUTES_TIMEOUT"); len(t) > 0 {
		minutes, _ = strconv.Atoi(t)
	}

	testTimeOut = time.Minute * time.Duration(minutes)
}

func runWithConsume() {
	if err, consumed := consumeAccounts(); err == nil {
		start := time.Now()
		errs := multiplexErrors(
			pubMerchants(qtdMerchants),
			pubSellers(qtdSellers),
		)

		for err := range errs {
			if err != nil {
				fmt.Println("pub err")
				panic(err)
			}
		}

		totalSent := qtdSellers + qtdMerchants
		success := false
		timeLimit := time.Now().Add(testTimeOut)

		fmt.Println("waiting for accounts consume")

		for time.Now().Before(timeLimit) {
			if *consumed == totalSent {
				success = true
				break
			}
		}

		if success {
			fmt.Println(fmt.Sprintf("SUCCESS: STRESS TESTS COMPLETED IN %s", time.Since(start)))
			fmt.Println(fmt.Sprintf("ALL %d MESSAGES PROCESSED", totalSent))
		} else {
			fmt.Println("TEST FAILED")
			fmt.Println(fmt.Sprintf("PROCESSED %d OF %d MESSAGES", *consumed, totalSent))
		}
	} else {
		fmt.Println("error on consume q-accounts", err)
	}

	os.Exit(0)
}

func runWithoutConsume() {
	errs := multiplexErrors(
		pubMerchants(qtdMerchants),
		pubSellers(qtdSellers),
	)

	for err := range errs {
		if err != nil {
			fmt.Println("pub err")
			panic(err)
		}
	}

	fmt.Println(fmt.Sprintf("all %d messages were published", qtdMerchants+qtdSellers))
}

// AMQP
type connection struct {
	conn    *amqp.Connection
	ch 	*amqp.Channel
	connect sync.Once
	isAlive bool
}

var singletonConn connection

func getChannel() (*amqp.Channel, error) {
	var (
		err error
	)

	singletonConn.connect.Do(func() {
		var url string
		if strings.ToUpper(os.Getenv("GO_ENV")) == "DOCKER" {
			url = "amqp://guest:guest@js-rabbit-mq:5672"
		} else {
			url = "amqp://guest:guest@localhost:5672"
		}

		singletonConn.conn, err = amqp.Dial(url)
	})

	if err == nil {
		if singletonConn.conn == nil || singletonConn.conn.IsClosed() {
			panic("rabbit connection is closed")
		} else if singletonConn.ch == nil {
			singletonConn.ch, err = singletonConn.conn.Channel()
		}
	}

	return singletonConn.ch, err
}

func publishMsg(data []byte, topic string) error {
	var (
		ch  *amqp.Channel
		qP  amqp.Queue
		err error
	)

	if ch, err = getChannel(); err == nil {
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
					if err := publishMsg(data, "q-merchants"); err != nil {
						err = errors.New("q-merchants err: " + err.Error())
						errs <- err
					}
				}
			}
		}

		errs <- err

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
					if err := publishMsg(data, "q-sellers"); err != nil {
						err = errors.New("q-sellers err: " + err.Error())
						errs <- err
					}
				}
			}
		}

		errs <- err

		close(errs)
	}()

	return errs
}

func consumeAccounts() (error, *int) {
	var (
		ch        *amqp.Channel
		processed int
		err       error
	)

	if ch, err = getChannel(); err == nil {
		var q amqp.Queue
		q, err = ch.QueueDeclare(
			"q-accounts",
			false,
			false,
			false,
			false,
			nil,
		)

		if err == nil {
			var msgs <-chan amqp.Delivery
			msgs, err = ch.Consume(
				q.Name,
				"c-stress",
				true,
				false,
				false,
				false,
				nil,
			)

			if err == nil {
				go func() {
					for _ = range msgs {
						processed++
						fmt.Println(fmt.Sprintf("processed %d messages", processed))
					}
				}()
			}
		}
	}

	return err, &processed
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
