import { MerchantSub } from "./subscriptions/MerchantSub"
import { SellerSub } from "./subscriptions/SellerSub"

import { subscribeConsumers, Subscription } from "../../infra/repositories/AmqpRepository"

import { AmqpEvents } from '../../infra/data/amqp/AmqpEventsEnum';

import AppEventsEmiter from "../../events/AppEventEmiter"

const getSubscriptions = (): Subscription[] => {
    return [
        new MerchantSub(),
        new SellerSub()
    ]
}

export default async function(): Promise<void> {
    await subscribeConsumers(getSubscriptions())

    AppEventsEmiter.addListener(AmqpEvents.AMQP_RECONNECT, async () => {
        await subscribeConsumers(getSubscriptions())
    })
}
