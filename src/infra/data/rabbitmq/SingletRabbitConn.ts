import amqp from "amqplib"

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
            console.log("connecting on rabbitmq")

            this.conn = await amqp.connect(this.connStr)

            console.log("successfully connected on rabbitmq")
        } catch(err) {
            console.log("error on try to connection on rabbitmq ", err)

            throw err
        }
    }   
    
    public static async getInstance(): Promise<SingletRabbitConn> {
        if(!SingletRabbitConn.instance) {
            SingletRabbitConn.instance = new SingletRabbitConn()
            await SingletRabbitConn.instance.connect()
        }

        return SingletRabbitConn.instance
    }

    public async subscribe(queue: string, msgHandler: any): Promise<void> {
        const ch = await this.newChannel()
        
        await ch.assertQueue(queue, { durable: false })
        await ch.consume(queue, msgHandler, { noAck: true })

        console.log(`subscribed on queue ${queue}`)
    }

    public async publish(queue: string, data: any): Promise<void> {
        const ch = await this.newChannel()

        try {
            await ch.assertQueue(queue, { durable: false })
            await ch.sendToQueue(queue, Buffer.from(data))            
            await ch.close()
        } catch(err) {
            console.log(`error on to publish data into ${queue} `, err)

            throw err
        }
    }

    private async newChannel(): Promise<any> {
        try {
            return await this.conn.createChannel()
        } catch(err) {
            console.log("error on try to get a new channel ", err)

            throw err
        }
    }
}

export default SingletRabbitConn