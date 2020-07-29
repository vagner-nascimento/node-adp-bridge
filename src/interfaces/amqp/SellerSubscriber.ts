import { config } from '../../config'

import SubscriberBase from './SubscriberBase';

import { getAccountAdapter } from '../../provider/index';

export default class SellerSubscriber extends SubscriberBase {
    constructor() {
        const accAdp = getAccountAdapter()
        
        super(
            config.integration.amqp.sub.seller,
            SellerSubscriber.name,
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
