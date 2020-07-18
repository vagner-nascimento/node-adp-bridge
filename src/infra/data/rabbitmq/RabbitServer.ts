import amqpLib from "amqplib"

import logger from "../../logger"

import { AppEvent, AppEventsEmiter as eventEmiter } from "../../../events"

import sleep from "../../../tools/Sleep"

import ApplicationError from '../../../error/ApplicationError';
import ms from '../../../tools/Sleep';
import RabbitConnection from './RabbitConnection';
import Retry from '../connection/Retry';

//"import" doesn't works for config here because it is null into constructor
const { config } = require("../../../config")

class RabbitServer {
    public constructor() {
        this.connStr = config.data.amqp.connStr
        this.exitOnLostConn = config.data.amqp.exitOnLostConnection
        this.rbConn = new RabbitConnection()

        const {
            sleep: msToSleep = 3000,
            maxTries = 1
        } = config.data.amqp.connRetry

        this.retry = new Retry(msToSleep, maxTries)
    }
    
    private rbConn: RabbitConnection
    private retry: Retry
    private connStr: string
    private connectedOnce: boolean
    private exitOnLostConn: boolean

    private async connect(event: AppEvent = AppEvent.AMQP_CONNECTED): Promise<void> {
        for(let current = 1; current <= this.retry.maxTries; current++) {
            try {
                logger.info("connecting into rabbitmq")

                this.rbConn.conn = await amqpLib.connect(this.connStr)
                this.rbConn.isConnected = true

                this.setConnEventHandlers()
                eventEmiter.emit(event)
                logger.info("successfully connected into rabbitmq")

                break
            } catch(err) {
                logger.error("error on try to connection into rabbitmq ", err)
                
                if(this.retry.maxTries > 1) {
                    const msg = `waiting ${this.retry.msToSleep} ms` +
                        ` before try to reconnect ${current} of ${this.retry.maxTries} tries`
                    
                    logger.info(msg)
                    await sleep(this.retry.msToSleep)
                }
            }
        }

        if(!this.rbConn.isConnected) {
            logger.info("failed to connect into amqp server")

            if(this.exitOnLostConn) process.exit(1)
        }
    }

    private setConnEventHandlers() {
        this.rbConn.conn.connection.on("close", err => {
            this.reConnect("amqp connection closed", err)
        })
        
        this.rbConn.conn.connection.on("error", err => {
            this.reConnect("amqp connection error", err)
        })
    }

    private reConnect(msg: string, err: Error): void {
        logger.error(msg, err)

        this.rbConn.isConnected = false
        
        this.connect(AppEvent.AMQP_RECONNECTED)
    }

    private async newChannel(): Promise<any> {
        if(!this.connectedOnce) {
            await this.connect()
                
            this.connectedOnce = true
        }

        if(this.rbConn.isConnected) return await this.rbConn.conn.createChannel()

        throw new ApplicationError("error on try to get a new amqp channel")
    }
    
    public async subscribe(queue: string, consumer: string, msgHandler: any): Promise<void> {
        try {
            const ch = await this.newChannel()
                
            await ch.assertQueue(queue, { durable: false })
            await ch.consume(queue, msgHandler, { noAck: true, consumerTag: consumer })

            logger.info(`consumer ${consumer} subscribed into amqp topic ${queue}`)
        } catch(err) {
            logger.error(`error on subscribe ${consumer} into amqp topic ${queue}`, err)

            throw err
        }
    }

    public async publish(queue: string, data: any): Promise<void> {        
        try {
            const ch = await this.newChannel()

            await ch.assertQueue(queue, { durable: false })
            await ch.sendToQueue(queue, Buffer.from(data))            
            await ch.close()
        } catch(err) {
            logger.error(`error on to publish data into ${queue} `, err)

            throw err
        }
    }
}

export default new RabbitServer()
