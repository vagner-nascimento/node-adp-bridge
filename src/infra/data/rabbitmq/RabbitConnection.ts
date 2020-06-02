import amqp from "amqplib"

// TODO properly handle errors
class RabbitConnection {
    private constructor() {
    }

    private conn: any
    private static instance: RabbitConnection

    private async connect(): Promise<void> {
        try {
            console.log("connecting on rabbitmq")
            this.conn = await amqp.connect("amqp://guest:guest@localhost:5672")
            console.log("successfully connected on rabbitmq")
        } catch(err) {
            console.log("error on try to connection on rabbitmq ", err)

            throw err
        }
    }   
    
    public static async getInstance(): Promise<RabbitConnection> {
        if(!RabbitConnection.instance) {
            RabbitConnection.instance = new RabbitConnection()
            
            await RabbitConnection.instance.connect()
        }

        return RabbitConnection.instance
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

export default RabbitConnection