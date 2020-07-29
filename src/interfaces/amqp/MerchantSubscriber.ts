import { config } from '../../config'

import SubscriberBase from './SubscriberBase'

export default class MerchantSubscriber extends SubscriberBase {
    constructor() {
        super(
            config.integration.amqp.sub.merchant,
            MerchantSubscriber.name,
            msg => {
                const jsonData = JSON.parse(msg.content)
    
                this.logInfo("message data received", jsonData)
    
                return true
            }
        )
    }    
}
