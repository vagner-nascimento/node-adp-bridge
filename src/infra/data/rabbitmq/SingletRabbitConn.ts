import amqp from "amqplib"

import logger from "../../logger"

import { config } from "../../../config"

class SingletRabbitConn {
    private constructor() {
        this.connStr = config.data.amqp.connStr
    }
    
    private conn: any
    private connStr: string
    private static instance: SingletRabbitConn

    private async connect(): Promise<void> {
        try {
            logger.info("connecting on rabbitmq")

            this.conn = await amqp.connect(this.connStr)
            
            this.setEvenHandlers()

            logger.info("successfully connected on rabbitmq")
        } catch(err) {
            //TODO: implements retry with sleep
            console.log("error on try to connection on rabbitmq ", err)

            throw err
        }
    }

    private setEvenHandlers(){
        //TODO: subscribe consumers again when reconnect
        this.conn.connection.on('close', err => {
            console.log('connection closed', err)

            this.connect()
        })
        
        this.conn.connection.on('error', err => {
            console.log('connection error', err)

            this.connect()
        })
    }
    
    public static async getInstance(): Promise<SingletRabbitConn> {
        if(!SingletRabbitConn.instance) {
            SingletRabbitConn.instance = new SingletRabbitConn()
            await SingletRabbitConn.instance.connect()
        }

        return SingletRabbitConn.instance
    }

    public async subscribe(queue: string, consumer: string, msgHandler: any): Promise<void> {
        const ch = await this.newChannel()
        
        await ch.assertQueue(queue, { durable: false })
        await ch.consume(queue, msgHandler, { noAck: true, consumerTag: consumer })

        logger.info(`subscribed on queue ${queue}`)
    }

    public async publish(queue: string, data: any): Promise<void> {
        const ch = await this.newChannel()

        try {
            await ch.assertQueue(queue, { durable: false })
            await ch.sendToQueue(queue, Buffer.from(data))            
            await ch.close()
        } catch(err) {
            logger.info(`error on to publish data into ${queue} `, err)

            throw err
        }
    }

    private async newChannel(): Promise<any> {
        try {
            return await this.conn.createChannel()
        } catch(err) {
            logger.info("error on try to get a new channel ", err)

            throw err
        }
    }
}

export default SingletRabbitConn
