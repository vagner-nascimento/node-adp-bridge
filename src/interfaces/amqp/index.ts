import { getAmqpSubscriber } from "../../provider"

import Subsciber from '../../integration/amqp/Subscriber'

import MerchantSubscriber from './MerchantSubscriber'

import SellerSubscriber from './SellerSubscriber'

const getSubs = (): Subsciber[] =>  {
    return [
        new MerchantSubscriber(),
        new SellerSubscriber()
    ]
}

export async function subscribeConsumers() {
    const sub = getAmqpSubscriber()
    
    await sub.subscibeConsumers(getSubs())
}
