import amqplib from 'amqplib'

import AmqpPubConnection from './AmqpPubConnection'

import Loggable from '../../logging/Loggable'

import ApplicationError from '../../../error/ApplicationError'

export default class AmqpPublisger extends Loggable{
    constructor(connStr: string) {
        super(AmqpPublisger.name)
        
        this.connStr = connStr
        this.queueInfo = { durable: false, exclusive: false, autoDelete: false }
        this.msgInfo = { madatory: false, immediate: false }
    }

    private connStr: string
    private queueInfo: any
    private msgInfo: any
    

    public async publish(queue: string, data: any): Promise<void> {
        const ch: amqplib.Channel = await AmqpPubConnection.getNewChannel(this.connStr)
        
        this.logInfo(`data to send to topic ${queue}:`, data)

        try {
            await ch.assertQueue(queue, this.queueInfo)
            await ch.sendToQueue(queue, Buffer.from(data), this.msgInfo)
            await ch.close()
        } catch(err) {
            const msg = `error on try to publish data into ${queue}`

            this.logError(msg, err)

            throw new ApplicationError(msg)
        }
    }
}
