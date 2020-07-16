import amqp from "amqplib"

import logger from "../../logger"

import eventEmiter from "../../../tools/EventEmiter"

import sleep from "../../../tools/Sleep"

import ApplicationError from '../../../error/ApplicationError';

const { config } = require("../../../config") //import doesn't works here

class SingletRabbitConn {
    public constructor() {
        this.connStr = config.data.amqp.connStr        
        this.conn = { isUp: false }

        const {
            sleep = 3000,
            maxTries = 1
        } = config.data.amqp.connRetry

        this.retry = {
            sleep,
            maxTries
        }

        this.connect()
    }
    
    private conn: any
    private connStr: string
    private retry: any

    private async connect(): Promise<void> {
        for(let current = 1; current <= this.retry.maxTries; current++) {
            try {
                logger.info("connecting into rabbitmq")

                this.conn = await amqp.connect(this.connStr)
                this.conn.isUp = true

                this.setEventsHandler()

                eventEmiter.emit("AmqpConnected")

                logger.info("successfully connected into rabbitmq")

                break
            } catch(err) {
                logger.error("error on try to connection into rabbitmq ", err)
                
                if(this.retry.maxTries > 1) {
                    const msg = `waiting ${this.retry.sleep} ms` +
                        ` before try to reconnect ${current} of ${this.retry.maxTries} tries`
                    
                    logger.info(msg)

                    await sleep(this.retry.sleep)
                }
            }
        }

        if(!this.conn.isUp) {
            if(config.data.amqp.exitOnLostConnection) process.exit(1)

            throw new ApplicationError("failed to connect into amqp server")
        }
    }

    private setEventsHandler(){
        this.conn.connection.on('close', err => {
            logger.error('connection closed', err)

            this.conn.isUp = false

            this.connect()
        })
        
        this.conn.connection.on('error', err => {
            logger.error('connection error', err)

            this.conn.isUp = false

            this.connect()
        })
    }

    private async newChannel(): Promise<any> {
        try {
            if(!this.conn || !this.conn.isUp) await this.connect()

            return await this.conn.createChannel()
        } catch(err) {
            logger.error("error on try to get a new channel ", err)

            throw err
        }
    }

    public async subscribe(queue: string, consumer: string, msgHandler: any): Promise<void> {
        const ch = await this.newChannel()
        
        await ch.assertQueue(queue, { durable: false })
        await ch.consume(queue, msgHandler, { noAck: true, consumerTag: consumer })

        logger.info(`subscribed on queue ${queue}`)
    }

    public async publish(queue: string, data: any): Promise<void> {
        const ch = await this.newChannel()

        try {
            await ch.assertQueue(queue, { durable: false })
            await ch.sendToQueue(queue, Buffer.from(data))            
            await ch.close()
        } catch(err) {
            logger.info(`error on to publish data into ${queue} `, err)

            throw err
        }
    }
}

export default new SingletRabbitConn()
