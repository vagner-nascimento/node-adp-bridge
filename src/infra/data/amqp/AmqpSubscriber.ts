import amqplib from 'amqplib'

import { AmqpEvents } from '../../repositories/amqp/AmqpEventsEnum';

import AppEventsEmiter from "../../../events/AppEventEmiter"

import Retry from '../connection/Retry';

import sleep from "../../../tools/Sleep"

import AmqConnection from './AmqpConnection'

import Loggable from '../../logger/Loggable';

const { config } = require("../../../config")

class AmqpSubscriber extends Loggable {
    constructor() {
        super(AmqpSubscriber.name)

        this.amqpConn = new AmqConnection(config.data.amqp.connStr)
        
        const {
            sleep: msToSleep = 3000,
            maxTries = 0
        } = config.data.amqp.connRetry

        this.retry = new Retry(msToSleep, maxTries)
        this.queueInfo = { durable: false, autoDelete: false, exclusive: false }
        this.msgInfo = { noAck: true, exclusive: false, noLocal: false }
    }

    private amqpConn: AmqConnection
    private isConnAlive: boolean
    private onceConnected: boolean
    private amqpChannel: amqplib.Channel
    private retry: Retry
    private queueInfo: any // TODO: create a type queue and msg info
    private msgInfo: any

    private setDisconnectEvents() {
        const handler = async (err: Error) => await this.reConnect(err)

        this.amqpConn.setOnCloseEventHandler(handler)
        this.amqpConn.setOnErrorEventHandler(handler)
    }

    private async connect(isFirstConn = false) {
        this.logInfo("connecting into amqp server")

        await this.amqpConn.connect()
        
        if(isFirstConn) this.isConnAlive = true

        AppEventsEmiter.emit(AmqpEvents.AMQP_SUB_CONNECTED)

        this.setDisconnectEvents()

        this.logInfo("successfully connected into amqp server")
    }

    private async reConnect(err: Error) {
        this.logError("error on amqp connection", err)
        this.amqpChannel = null

        for(let current = 1; current <= this.retry.maxTries; current++) {
            try {
                const msg = `waiting ${this.retry.msToSleep} ms` +
                        ` before try to reconnect ${current} of ${this.retry.maxTries} tries`
                
                this.logInfo(msg)

                await sleep(this.retry.msToSleep)

                await this.connect()

                AppEventsEmiter.emit(AmqpEvents.AMQP_SUB_RECONNECTED)

                break
            } catch(err) {
                this.logError("error on try to reconnect into amqp server", err)

                continue
            }
        }

        if(!this.amqpConn.isConnected()) {
            this.isConnAlive = false

            this.logInfo("amqp connection lost forever")

            AppEventsEmiter.emit(AmqpEvents.AMQP_SUB_LOST_CONN)
        }
    }

    private async connectOnce() {
        if(!this.onceConnected) {
            this.onceConnected = true

            try {
                await this.connect(true)
            } catch(err) {
                await this.reConnect(err)
            }
        }
    }

    public async subscribeConsumer(queue: string, consumer: string, msgHandler: (data: any) => any) {
        await this.connectOnce()
        
        while(this.isConnAlive) {
            if(this.amqpConn.isConnected()) {
                if(!this.amqpChannel) this.amqpChannel = await this.amqpConn.getChannel()

                let consumerMsgInfo = Object.assign({}, this.msgInfo)
                consumerMsgInfo = Object.assign(consumerMsgInfo, { consumerTag: consumer })

                await this.amqpChannel.assertQueue(queue, this.queueInfo)                
                await this.amqpChannel.consume(queue, msgHandler, consumerMsgInfo)

                this.logInfo(`consumer ${consumer} subscribed into topic ${queue}`)

                return
            }
        }

        this.logInfo(`amqp connection was lost, cannot subscribe ${consumer} into topic ${queue}`)
    }
}

export default new AmqpSubscriber()
