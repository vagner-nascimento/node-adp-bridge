import subscribeConsumers from "../integration/amqp/Subscriber"
import startRestPresentation from "../presentation/rest/Server"

export default async (): Promise<void> => {
    await subscribeConsumers()
    await startRestPresentation()
}