import Merchant from '../types/Merchant';

export function createMerchant(data: any): Merchant {
    return new Merchant(data);
}
