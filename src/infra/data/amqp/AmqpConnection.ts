import amqplib from 'amqplib'

import ApplicationError from '../../../error/ApplicationError'

import Loggable from '../../logger/Loggable';

export default class AmqConnection extends Loggable{
    constructor(connStr: string) {
        super(AmqConnection.name)

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
            const msg = `error on try to connect into amqp server`

            this.logError(msg, err)

            throw new ApplicationError(msg)
        }
    }

    //TODO: make a class to handle channel
    public async getChannel(): Promise<amqplib.Channel> {
        try {
            return await this.amqConn.createChannel()
        } catch(err) {
            const msg = "error on try to get an amqp channel"

            this.logError(msg, err)
    
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
