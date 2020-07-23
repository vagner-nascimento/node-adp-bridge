import amqplib from 'amqplib'

import logger from "../../logger"

import ApplicationError from '../../../error/ApplicationError'

export default class AmqConnection {
    constructor(connStr: string) {
        this.connStr = connStr
    }

    private connStr: string
    private amqConn: any
    private connected: boolean

    private setEventsHandler() {
        const handler = () => {
            this.connected = false
        }

        this.setOnCloseEventHandler(handler)
        this.setOnErrorEventHandler(handler)
    }

    public async connect() {
        try {
            this.amqConn = await amqplib.connect(this.connStr)
            this.connected = true

            this.setEventsHandler()
        } catch(err) {
            const msg = `${this.constructor.name} - error on try to connect into amqp server`

            logger.error(msg, err)

            throw new ApplicationError(msg)
        }
    }

    //TODO: make a class to handle channel
    public async getChannel(): amqplib.Channel {
        try {
            return await this.amqConn.createChannel()
        } catch(err) {
            const msg = "error on try to get an amqp channel"
    
            logger.error(msg, err)
    
            throw new ApplicationError(msg)
        }
    }
    
    public setOnCloseEventHandler(handler: (err: Error) => any) {
        this.amqConn.connection.on("close", handler)
    }

    public setOnErrorEventHandler(handler: (err: Error) => any) {
        this.amqConn.connection.on("error", handler)
    }

    public isConnected(): boolean {
        return this.connected
    }
}
