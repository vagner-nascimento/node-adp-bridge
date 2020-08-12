import amqplib from 'amqplib'

import config from '../../../../config'

import Loggable from '../../logging/Loggable'

import ApplicationError from '../../../error/ApplicationError'

class AmqpPublisher extends Loggable {
    constructor() {
        super(AmqpPublisher.name)

        this.connStr = config.data.amqp.connStr
        this.queueInfo = { durable: false, exclusive: false, autoDelete: false }
        this.msgInfo = { madatory: false, immediate: false }
    }

    private connStr: string
    private conn: any
    private queueInfo: any
    private msgInfo: any

    // TODO: realise how to use one cahnnel by thread
    public async publish(queue: string, data: any): Promise<void> {
        if(!this.conn) this.connect()

        try {
            const ch = await this.conn.createChannel()

            await ch.assertQueue(queue, this.queueInfo)
            await ch.sendToQueue(queue, Buffer.from(data), this.msgInfo)
            await ch.close()
        } catch(err) {
            const msg = `error on try to publish data into ${queue}`

            this.logError(msg, err)

            throw new ApplicationError(msg)
        }
    }

    // TODO: it should made on pub and sub, realise a way to make absctract
    private async connect(): Promise<void> {
        this.logInfo('connecting into AMQP server')

        try {
            this.conn = await amqplib.connect(this.connStr)
            
            this.conn.connection.on('close', err => {
                this.conn = null
                const msg = 'AMQP connection CLOSED'
                
                this.logError(msg, err)
            })

            this.conn.connection.on('error', err => {
                this.conn = null
                const msg = 'AMQP connection ERROR'

                this.logError(msg, err)
            })
        } catch (err) {
            const msg = `error on try to connect into amqp server`

            this.logError(msg, err)

            throw new ApplicationError(msg)
        }
    }
}

export default new AmqpPublisher()
