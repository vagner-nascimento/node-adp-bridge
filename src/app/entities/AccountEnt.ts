import Merchant from '../types/Merchant';
import Account from '../types/Account';

export function createAccountFromMerchant(merch: Merchant): Account {
    return new Account(merch.id);
}
