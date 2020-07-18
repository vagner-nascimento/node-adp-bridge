import { MerchantSub } from "./subscriptions/MerchantSub"
import { SellerSub } from "./subscriptions/SellerSub"

import { subscribeConsumers, Subscription } from "../../infra/repositories/AmqpRepository"

import { AppEvent, AppEventsEmiter as eventEmiter } from "../../events"

const getSubscriptions = (): Subscription[] => {
    return [
        new MerchantSub(),
        new SellerSub()
    ]
}

export default async function(): Promise<void> {
    await subscribeConsumers(getSubscriptions())

    eventEmiter.addListener(AppEvent.AMQP_RECONNECTED, async () => {
        await subscribeConsumers(getSubscriptions())
    })
}
