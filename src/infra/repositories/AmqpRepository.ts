import rbConn from "../data/rabbitmq/RabbitConnection"

export interface Subscription {
    getTopic(): string
    getHandler(): any // TODO realise how to specify func type
}

export async function subscribeAll(subs: Subscription[]): Promise<void> {
    const conn = await rbConn.getInstance()

    for(const sub of subs) {
        await conn.subscribe(sub.getTopic(), sub.getHandler())
    }
}