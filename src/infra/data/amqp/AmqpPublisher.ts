import amqplib from 'amqplib'

import AmqConnection from './AmqpConnection'

import logger from "../../logger"

import ApplicationError from '../../../error/ApplicationError';

const { config } = require("../../../config")

class AmqpPublisher {
    constructor() {
        this.amqpConn = new AmqConnection(config.data.amqp.connStr)
    }

    private amqpConn: AmqConnection
    private amqpChannel: amqplib.Channel
    /*
        TODO: amqp conn error with 10k msgs:
        2020-07-23 04:44:23.048Z - AmqConnection - error on try to connect into amqp server { Error: read ECONNRESET
            at TCP.onStreamRead (internal/stream_base_commons.js:111:27)
        cause:
        { Error: read ECONNRESET
            at TCP.onStreamRead (internal/stream_base_commons.js:111:27) errno: 'ECONNRESET', code: 'ECONNRESET', syscall: 'read' },
        isOperational: true,
        errno: 'ECONNRESET',
        code: 'ECONNRESET',
        syscall: 'read' }

    */
    private async connect() {
        if(!this.amqpConn || !this.amqpConn.isConnected()) {
            this.amqpChannel = null

            await this.amqpConn.connect()
        }
    }

    private logInfo(msg: string, data: any = null) {
        logger.info(`${this.constructor.name} - ${msg}`, data)
    }
    
    private logError(msg: string, err: Error = null) {
        logger.error(`${this.constructor.name} - ${msg}`, err)
    }

    public async publishMessage(queue: string, data: any) {
        try {
            await this.connect()
            
            if(!this.amqpChannel) this.amqpChannel = await this.amqpConn.getChannel()
            
            this.logInfo(`data to send to topic ${queue}:`, data)

            await this.amqpChannel.assertQueue(queue, { durable: false })
            await this.amqpChannel.sendToQueue(queue, Buffer.from(data))
        } catch(err) {
            const msg = `error on try to publish data into ${queue}`

            this.logError(msg, err)

            throw new ApplicationError(msg)
        }
    }
}

export default new AmqpPublisher()
