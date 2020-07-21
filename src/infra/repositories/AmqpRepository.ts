import AmqpServer from "../data/amqp/AmqpServer"

export interface Subscription {
    getTopic(): string
    getConsumer(): string
    getHandler(): Function
}

export async function subscribeConsumers(subs: Subscription[]): Promise<void> {
    for(const sub of subs) {
        await AmqpServer.subscribe(sub.getTopic(), sub.getConsumer(), sub.getHandler())
    }
}
