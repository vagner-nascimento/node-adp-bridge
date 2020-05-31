import amqp from "amqplib"

// TODO test singleton rabbit conn
// TODO properly handle errors
class RabbitConnection {
    private constructor() {
    }

    private conn
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

    // TODO msgHandler: create a type to this func
    public async subscribe(queueName, msgHandler): Promise<void> {
        const ch = await this.newChannel()
        
        ch.assertQueue(queueName, { durable: false })
        ch.consume(queueName, msgHandler, { noAck: true })

        console.log(`subscribed on queue ${queueName}`)
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