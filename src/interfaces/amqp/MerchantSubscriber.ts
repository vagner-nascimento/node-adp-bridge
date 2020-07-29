import { config } from '../../config'

import SubscriberBase from './SubscriberBase'

import { getAccountAdapter } from "../../provider"

export default class MerchantSubscriber extends SubscriberBase {
    constructor() {
        const accAdp = getAccountAdapter()

        super(
            config.integration.amqp.sub.merchant,
            MerchantSubscriber.name,
            async msg => {
                const jsonData = JSON.parse(msg.content)
    
                this.logInfo("message data received", jsonData)

                try {
                    await accAdp.addAccount(jsonData)
                    return true
                } catch {
                    return false
                }
            }
        )
    }    
}
