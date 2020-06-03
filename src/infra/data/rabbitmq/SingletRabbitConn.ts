import amqp from "amqplib"

// 
class SingletRabbitConn {
    private constructor() {
    }

    private conn: any
    private static instance: SingletRabbitConn

    private async connect(): Promise<void> {
        try {
            console.log("connecting on rabbitmq")
            // TODO put conn str on env config
            this.conn = await amqp.connect("amqp://guest:guest@js-rabbit-mq:5672")

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
        
        ch.assertQueue(queue, { durable: false })
        ch.consume(queue, msgHandler, { noAck: true })

        console.log(`subscribed on queue ${queue}`)
    }

    public async publish(queue: string, data: any): Promise<void> {
        const ch = await this.newChannel()

        ch.assertQueue(queue, { durable: false })
        ch.sendToQueue(queue, Buffer.from(data))
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