import { getAmqpSubHandler } from '../../provider'

import Subscriber from './subscribers/Subscriber'

import AmqpSubHandler from './AmqpSubHandler'
import { getSubscribers } from './subscribers'



const subscribe = async (sub: Subscriber): Promise<void> => {
    const subHandler: AmqpSubHandler = getAmqpSubHandler()

    await subHandler.subscribeConsumer(
        sub.getTopic(),
        sub.getConsumer(),
        sub.getHandler()
    )
}

export async function subscribeConsumers(): Promise<void> {
    for(const sub of getSubscribers()) await subscribe(sub)
}
