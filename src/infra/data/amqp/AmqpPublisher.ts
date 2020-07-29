import amqplib from 'amqplib'

import { config } from "../../../config"

import LoggerHandler from '../../logger/LoggerHandler'

import ApplicationError from '../../../error/ApplicationError'

let singPubConn: any

// TODO: make comfirm, ak an nak
// TODO: realise why creates a lot of connections when run 50k msg on stress test
export default class AmqpPublisher extends LoggerHandler {
    constructor(topic: string) {
        super(AmqpPublisher.name)

        this.topic = topic
        this.connStr = config.data.amqp.connStr

        this.queueInfo = { durable: false, exclusive: false, autoDelete: false }
        this.msgInfo = { madatory: false, immediate: false }
    }

    private topic: string
    private connStr: string
    private chann: amqplib.Channel
    private queueInfo: any
    private msgInfo: any


    public async publish(data: any) {
        await this.assertChannel()

        this.logInfo(`data to send to AMQP topic ${this.topic}`, data)

        try {
            await this.chann.assertQueue(this.topic, this.queueInfo)
            await this.chann.sendToQueue(this.topic, Buffer.from(data), this.msgInfo)
        } catch(err) {
            this.logError(`error on send data to ${this.topic}`, err)

            throw new ApplicationError(`an error occours on try to send data to ${this.topic}`)
        }
    }

    private async assertChannel() {
        if(!this.chann){
            await this.assertConnection()

            try {
                this.chann = await singPubConn.createChannel()

                this.chann.on("close", err => {
                    this.logError("AMQP pub channel was closed", err)
                    
                    this.chann = null
                })
                
                this.chann.on("error", err => {
                    this.logError("AMQP pub channel error", err)
                    
                    this.chann = null
                })
            } catch(err) {
                this.logError("error on create an AQMP channel", err)

                throw new ApplicationError("an error occours on try to create an AMQP channel")
            }
        }
    }

    private async assertConnection() {
        if(!singPubConn) await this.connect()
    }

    private async connect() {
        try {
            singPubConn = await amqplib.connect(this.connStr)

            singPubConn.connection.on("close", err => {
                this.logError("AMQP connection was closed", err)
                
                this.chann = null
                singPubConn = null
            })

            singPubConn.connection.on("error", err => {
                this.logError("error on AMQP connection", err)

                this.chann = null
                singPubConn = null
            })
        } catch(err) {
            this.logError("error on connect into AMQP server", err)

            throw new ApplicationError("an error occours on try to connect into AMQP server")
        }
    }
}
