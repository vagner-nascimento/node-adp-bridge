import { MerchantSub } from './subscriptions/MerchantSub';
import { SellerSub } from './subscriptions/SellerSub';
import { subscribeAll, Subscription } from '../../infra/repositories/AmqpRepository';

const getSubscriptions = (): Subscription[] => {
    return [
        new MerchantSub(),
        new SellerSub()
    ]
}

export default async function(): Promise<void> {
    await subscribeAll(getSubscriptions())
}