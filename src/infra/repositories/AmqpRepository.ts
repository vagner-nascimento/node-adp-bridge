import SingletRabbitConn from "../data/rabbitmq/SingletRabbitConn"

export interface Subscription {
    getTopic(): string
    getConsumer(): string
    getHandler(): Function
}

export async function subscribeAll(subs: Subscription[]): Promise<void> {
    const conn = await SingletRabbitConn.getInstance()

    for(const sub of subs) {
        await conn.subscribe(sub.getTopic(), sub.getConsumer(), sub.getHandler())
    }
}
