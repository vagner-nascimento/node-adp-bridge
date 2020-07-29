import { config } from '../../config'

import SubscriberBase from './SubscriberBase';

export default class SellerSubscriber extends SubscriberBase {
    constructor() {
        super(
            config.integration.amqp.sub.seller,
            SellerSubscriber.name,
            msg => {
                const jsonData = JSON.parse(msg.content)
    
                this.logInfo("message data received", jsonData)
    
                return true
            }
        )
    }
}
