import Subscriber from './Subscriber'
import MerchantSub from './MerchantSub'
import SellerSub from './SellerSub'

export function getSubscribers(): Subscriber[] {
    return [
        new MerchantSub(),
        new SellerSub()
    ]
}
