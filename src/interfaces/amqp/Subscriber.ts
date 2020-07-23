import { MerchantSub } from "./subscriptions/MerchantSub"
import { SellerSub } from "./subscriptions/SellerSub"

import { subscribeConsumers, Subscription } from "../../infra/repositories/AmqpRepository"
import { AmqpEvents } from '../../infra/repositories/amqp/AmqpEventsEnum';

import AppEventEmiter from "../../events/AppEventEmiter"

const getSubscriptions = (): Subscription[] => {
    return [
        new MerchantSub(),
        new SellerSub()
    ]
}

import { config } from "../../config"
import logger from "../../infra/logger";

export default async function() {
    AppEventEmiter.addListener(AmqpEvents.AMQP_SUB_RECONNECTED, async () => { 
        await subscribeConsumers(getSubscriptions())
    })

    AppEventEmiter.addListener(AmqpEvents.AMQP_SUB_LOST_CONN, async () => {
        logger.info("amqp sub conn lost forever")

        if(config.data.amqp.exitOnLostConnection) {
            logger.info("shuting down the application")
            process.exit(1)
        }
    })

    await subscribeConsumers(getSubscriptions())
}
