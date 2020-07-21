import amqpLib from "amqplib"

import logger from "../../logger"

import AppEventsEmiter from "../../../events/AppEventEmiter"

import { AmqpEvents } from "./AmqpEventsEnum"

import sleep from "../../../tools/Sleep"

import ApplicationError from '../../../error/ApplicationError';

import AmqpSingletonConnection from '../connection/AmqpSingletonConnection';

import Retry from '../connection/Retry';
import ms from '../../../tools/Sleep';

//"import" doesn't works for config here because it is null into constructor
const { config } = require("../../../config")

// TODO: log amqplib erros and throw App Erros
class AmqpServer {
    public constructor() {
        this.connStr = config.data.amqp.connStr
        this.exitOnLostConn = config.data.amqp.exitOnLostConnection
        this.rbConn = new AmqpSingletonConnection()

        const {
            sleep: msToSleep = 3000,
            maxTries = 1
        } = config.data.amqp.connRetry

        this.retry = new Retry(msToSleep, maxTries)
    }
    
    private rbConn: AmqpSingletonConnection
    private retry: Retry
    private connStr: string
    private exitOnLostConn: boolean

    private async connect(notifyEvent: AmqpEvents = AmqpEvents.AMQP_CONNECT): Promise<void> {
        for(let current = 1; current <= this.retry.maxTries; current++) {
            try {
                logger.info("connecting into amqp server")

                this.rbConn.conn = await amqpLib.connect(this.connStr)
                this.rbConn.isConnected = true
                
                this.setConnEventHandlers()
                AppEventsEmiter.emit(notifyEvent)
                
                logger.info("successfully connected into amqp server")

                break
            } catch(err) {
                logger.error("error on try to connection into amqp server ", err)
                
                if(this.retry.maxTries > 1) {
                    const msg = `waiting ${this.retry.msToSleep} ms` +
                        ` before try to reconnect ${current} of ${this.retry.maxTries} tries`
                    
                    logger.info(msg)
                    await sleep(this.retry.msToSleep)
                }
            }
        }

        if(!this.rbConn.isConnected) {
            this.rbConn.isAlive = false

            logger.info("amqp server connection is lost forever")

            if(this.exitOnLostConn) {
                logger.info("amqp policy: shuting down de application")                
                process.exit(1)
            }
        }
    }
    RabbitConnection
    private setConnEventHandlers() {
        this.rbConn.conn.connection.on("close", async err => {
            await this.reConnect("amqp connection closed", err)
        })
        
        this.rbConn.conn.connection.on("error", async err => {
            await this.reConnect("amqp connection error", err)
        })
    }

    private async reConnect(msg: string, err: Error) {
        this.rbConn.isConnected = false

        logger.error(msg, err)
        
        await this.connect(AmqpEvents.AMQP_RECONNECT)
    }

    private async newChannel(): Promise<any> {
        if(!this.rbConn.connOnce) {
            await this.connect()
            
            this.rbConn.isAlive = true
            this.rbConn.connOnce = true
        }

        while(this.rbConn.isAlive) {
            if(this.rbConn.isConnected) return await this.rbConn.conn.createChannel()
        }

        throw new ApplicationError("error on try to get a new amqp channel")
    }
    
    public async subscribe(queue: string, consumer: string, msgHandler: any): Promise<void> {
        try {
            const ch = await this.newChannel()
                
            await ch.assertQueue(queue, { durable: false })
            await ch.consume(queue, msgHandler, { noAck: true, consumerTag: consumer })
            // await ch.close()

            logger.info(`consumer ${consumer} subscribed into amqp topic ${queue}`)
        } catch(err) {
            const msg = `error on subscribe ${consumer} into amqp topic ${queue}`

            logger.error(`error on subscribe ${consumer} into amqp topic ${queue}`, err)

            throw new ApplicationError(msg)
        }
    }

    public async publish(queue: string, data: any): Promise<void> {
        try {
            logger.info(`${this.constructor.name}.${this.publish.name} - data to send to topic ${queue}: `, data)

            const ch = await this.newChannel()

            await ch.assertQueue(queue, { durable: false })
            await ch.sendToQueue(queue, Buffer.from(data))
            await ch.close()
        } catch(err) {
            const msg = `error on to publish data into ${queue} `
            
            logger.error(msg, err)

            throw new ApplicationError(msg)
        }
    }
}

export default new AmqpServer()
