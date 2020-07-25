import AmqpSubscriber from "../data/amqp/AmqpSubscriber"

export interface Subscription {
    getTopic(): string
    getConsumer(): string
    getHandler(): (data: any) => void
}

export async function subscribeConsumers(subs: Subscription[]) {
    for(const sub of subs) {
        await AmqpSubscriber.subscribeConsumer(sub.getTopic(), sub.getConsumer(), sub.getHandler())
    }
}
