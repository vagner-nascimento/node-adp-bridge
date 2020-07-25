import amqplib from 'amqplib'

import AmqConnection from './AmqpConnection'

import ApplicationError from '../../../error/ApplicationError';

import Loggable from '../../logger/Loggable';

const { config } = require("../../../config")

class AmqpPublisher extends Loggable {
    constructor() {
        super(AmqpPublisher.name)

        this.amqpConn = new AmqConnection(config.data.amqp.connStr)
        this.queueInfo = { durable: false, exclusive: false, autoDelete: false }
        this.msgInfo = { madatory: false, immediate: false }
    }

    private amqpConn: AmqConnection
    private amqpChannel: amqplib.Channel
    private queueInfo: any
    private msgInfo: any

    private async connect() {
        if(!this.amqpConn || !this.amqpConn.isConnected()) {
            this.amqpChannel = null

            await this.amqpConn.connect()
        }
    }

    public async publishMessage(queue: string, data: any) {
        try {
            await this.connect()
            
            if(!this.amqpChannel) this.amqpChannel = await this.amqpConn.getChannel()
            
            this.logInfo(`data to send to topic ${queue}:`, data)

            await this.amqpChannel.assertQueue(queue, this.queueInfo)
            await this.amqpChannel.sendToQueue(queue, Buffer.from(data), this.msgInfo)
        } catch(err) {
            const msg = `error on try to publish data into ${queue}`

            this.logError(msg, err)

            throw new ApplicationError(msg)
        }
    }
}

export default new AmqpPublisher()
