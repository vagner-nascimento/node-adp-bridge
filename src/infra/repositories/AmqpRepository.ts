import RabbitServer from "../data/amqp/RabbitServer"

export interface Subscription {
    getTopic(): string
    getConsumer(): string
    getHandler(): Function
}

export async function subscribeConsumers(subs: Subscription[]): Promise<void> {
    for(const sub of subs) {
        await RabbitServer.subscribe(sub.getTopic(), sub.getConsumer(), sub.getHandler())
    }
}
