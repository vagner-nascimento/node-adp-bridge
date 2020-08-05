import Merchant from '../types/Merchant';
import Account from '../types/Account';
import Seller from '../types/Seller';
import AccountType from '../types/AccountTypeEnum';

export function createAccountFromMerchant(mer: Merchant): Account {
    return Account
        .build(AccountType.MERCHANT)
        .setId(mer.id)
        .setName(mer.name)
}

export function createAccountFromSeller(sell: Seller): Account {
    return Account
        .build(AccountType.SELLER)
        .setId(sell.id)
        .setName(sell.name)
        .setMerchantId(sell.merchant_id)
        .setMerchantAccountId(sell.merchant_account_id)
        .setContacts(sell.contacts)
}
