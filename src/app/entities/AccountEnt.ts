import Merchant from '../types/Merchant';
import Account from '../types/Account';
import Seller from '../types/Seller';

export function createAccountFromMerchant(merch: Merchant): Account {
    return new Account(merch.id);
}

export function createAccountFromSeller(sell: Seller): Account {
    return new Account(sell.id);
}
