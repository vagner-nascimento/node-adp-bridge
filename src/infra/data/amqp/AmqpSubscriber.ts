import amqplib from 'amqplib'

import { config } from "../../../config"

import AppEventEmiter from "../../../events/AppEventEmiter"

import { AmqpEvents } from '../../../events/amqp/AmqpEventsEnum'

import ApplicationError from '../../../error/ApplicationError'

import Retry from '../connection/Retry'

import LoggerHandler from '../../logger/LoggerHandler'

import sleep from '../../../tools/Sleep'

 export default class AmqpSubscriber extends LoggerHandler {
    private constructor() {
        super(AmqpSubscriber.name)
         
        this.connStr = config.data.amqp.connStr
         
        const retConf = config.data.amqp.connRetry
        this.retry = new Retry(retConf.sleep, retConf.maxTries)
        this.queueInfo = { durable: false, autoDelete: false, exclusive: false }
        this.msgInfo = { noAck: true, exclusive: false, noLocal: false }
    }

    private static instance: AmqpSubscriber
     
    private connStr: string
    private conn: any
    private chann: amqplib.Channel

    private queueInfo: any // TODO: create a type queue and msg info
    private msgInfo: any
     
    private retry: Retry
    private isOnline: boolean = false
          
    public static async getSubscriber(): Promise<AmqpSubscriber> {
        if(!AmqpSubscriber.instance) {
           AmqpSubscriber.instance = new AmqpSubscriber()

           await AmqpSubscriber.instance.startConnection()
        }

       return AmqpSubscriber.instance
    }

    public listenReconnectEvent(handler: () => any) {
        AppEventEmiter.addListener(AmqpEvents.AMQP_SUB_RECONNECTED, handler)
    }

    public listenLostConnForeverEvent(handler: () => any) {
        AppEventEmiter.addListener(AmqpEvents.AMQP_SUB_LOST_CONN, handler)
    }
    
    public listenConnectedEvent(handler: () => any) {
        AppEventEmiter.addListener(AmqpEvents.AMQP_SUB_CONNECTED, handler)
    }

    public async subscribeConsumer(queue: string, consumer: string, msgHandler: (data: any) => any) {
        try {
            await this.setChannel()
            
            let consumerMsgInfo = Object.assign({}, this.msgInfo)
                consumerMsgInfo = Object.assign(consumerMsgInfo, { consumerTag: consumer })

            await this.chann.assertQueue(queue, this.queueInfo)      
            await this.chann.consume(queue, msgHandler, consumerMsgInfo)

            this.logInfo(`consumer ${consumer} subscribed into ${queue}`, null, this.subscribeConsumer.name)
        } catch(err) {
            this.logError(`error on subscribe ${consumer} into ${queue}`, err, this.subscribeConsumer.name)

            throw new ApplicationError(`an error occours on try to subscribe ${consumer} into ${queue}`)
        }
    }

    private isConnected(): boolean {
        return this.isOnline
    }


    private async startConnection() {
        try {
            await this.connect()

            AppEventEmiter.emit(AmqpEvents.AMQP_SUB_CONNECTED)
        } catch(err) {
            this.logError("error on try to start AMQP connection", err, this.startConnection.name)
            
            await this.retryConnection()

            if(this.isConnected) AppEventEmiter.emit(AmqpEvents.AMQP_SUB_CONNECTED)
        }
    }

     private async connect() {
        try {
            this.conn = await amqplib.connect(this.connStr)        
            this.isOnline = true

            this.logInfo("successfully connectd into AMQP server", null, this.connect.name)
            
            this.conn.connection.on("close", async err => {
                this.isOnline = false
                this.chann = null

                this.logError("AMQP connection was closed", err)
                
                await this.retryConnection()
            })

            this.conn.connection.on("error", async err => {
                this.isOnline = false
                this.chann = null

                this.logError("error on AMQP connection", err)
                
                await this.retryConnection()
            })
        } catch(err) {
            this.isOnline = false

            throw err
        }
     }

     private async retryConnection() {
        for(let current = 1; current <= this.retry.maxTries; current++) {
            try {
                const msg = `waiting ${this.retry.msToSleep} ms before try to ` + 
                    `reconnect into AMQP server ${current} of ${this.retry.maxTries}`

                this.logInfo(msg)
                
                await sleep(this.retry.msToSleep)

                await this.connect()
                break
            } catch(err) {
                this.logError("error on retry to reconnect into AMQP server", err)

                continue
            }
        }

        if(this.isConnected()) {
            AppEventEmiter.emit(AmqpEvents.AMQP_SUB_RECONNECTED)
        } else {
            this.logInfo("AMQP connection lost forever")

            AppEventEmiter.emit(AmqpEvents.AMQP_SUB_LOST_CONN)
        }
     }

     private async setChannel() {
         if(this.isConnected()) {
            if(!this.chann) {
                try {
                    this.chann = await this.conn.createChannel()

                    this.chann.on("close", err => {
                        this.logError("AMQP sub channel was closed", err)
                        
                        this.chann = null
                    })
                    
                    this.chann.on("error", err => {
                        this.logError("AMQP sub channel error", err)
                        
                        this.chann = null
                    })
                } catch(err) {
                    this.logError("error on create an AQMP channel", err)

                    throw err
                }
            }
         } else {
            throw new ApplicationError("cannot create an AMQP channel because connection is closed")
         }
     }
 }
 