import amqplib from 'amqplib'

import config from '../../../../config'

import Loggable from '../../logging/Loggable'

import ApplicationError from '../../../error/ApplicationError'

class AmqpSubscriber extends Loggable {
    constructor() {
        super(AmqpSubscriber.name)
        
        this.connStr = config.data.amqp.connStr        
        this.subQueueInfo = { durable: false, autoDelete: false, exclusive: false }
        this.subMsgInfo = { noAck: true, exclusive: false, noLocal: false }
    }

    private connStr: string
    private conn: any
    private chann: amqplib.Channel
    private subQueueInfo: any
    private subMsgInfo: any

    public async subscribeConsumer(topic: string, consumer: string, handler: (msg: any) => Promise<any>) {
        if(!this.conn) await this.connect()
        if(!this.chann) await this.setChannel()
        
        let consumerMsgInfo = Object.assign({}, this.subMsgInfo)
        consumerMsgInfo = Object.assign(consumerMsgInfo, { consumerTag: consumer })
        
        try {
            await this.chann.assertQueue(topic, this.subQueueInfo)
            await this.chann.consume(topic, handler, consumerMsgInfo)

            this.logInfo(`consumer ${consumer} subscribed into ${topic}`)
        } catch(err) {
            const msg = `error on subscrube ${consumer} into "${topic}"`

            this.logError(msg, err)
            
            throw new ApplicationError(msg)
        }
    }

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

            this.logInfo('successfully connected into AMQP server')
        } catch (err) {
            const msg = `error on try to connect into amqp server`

            this.logError(msg, err)

            throw new ApplicationError(msg)
        }
    }

    private async setChannel() {
        try {
            this.chann = await this.conn.createChannel()

            this.chann.on('close', err => {
                this.chann = null
                const msg = 'AMQP channel CLOSED'

                this.logError(msg, err)
            })

            this.chann.on('error', err => {
                this.chann = null
                const msg = 'AMQP channel ERROR'

                this.logError(msg, err)
            })
        } catch(err) {
            const msg = 'error ont try to get an AMQP channel'

            this.logError(msg, err)

            throw new ApplicationError(msg)
        }        
    }
}

export default new AmqpSubscriber()
