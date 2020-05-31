import subscribeConsumers from "../integration/amqp/Subscriber"
import startRestPresentation from "../presentation/rest/Server"

export default async (): Promise<void> => {
    await subscribeConsumers()
    console.log("amqp consumers subscribed")

    await startRestPresentation()
    console.log("rest presentation loaded")
}