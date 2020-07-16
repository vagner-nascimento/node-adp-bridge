import { MerchantSub } from "./subscriptions/MerchantSub"
import { SellerSub } from "./subscriptions/SellerSub"

import { subscribeAll, Subscription } from "../../infra/repositories/AmqpRepository"

import eventEmiter from "../../tools/EventEmiter"

const getSubscriptions = (): Subscription[] => {
    return [
        new MerchantSub(),
        new SellerSub()
    ]
}

export default async function(): Promise<void> {
    eventEmiter.on("AmqpConnected", async () => {
        await subscribeAll(getSubscriptions())
    })
}
