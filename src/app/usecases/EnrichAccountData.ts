import Merchant from '../entities/Merchant';

import Account from '../entities/Account';
import AccountType from '../entities/AccountType';

import AccountDataHandler from '../interfaces/AccountDataHandler';

const enrichSellerAccount = (account: Account, merchant: Merchant): Account => {
    const acc = Object.assign({}, account)
    
    if(merchant instanceof Merchant)
        acc.country = merchant.country

    return acc
}

export function getEnrichmentStrategy(accTyp: string, repo: AccountDataHandler): any {
    switch(accTyp) {
        case AccountType.SELLER:
            return async (acc: Account) => {
                let merchant: Merchant                
                try {
                    merchant = await repo.GetMerchant(acc.merchant_id)

                    return enrichSellerAccount(acc, merchant)
                } catch(err) {
                    return acc
                }
            }
        case AccountType.MERCHANT:
            // TODO develop merchant enrichment
            return async (acc: Account) => (acc)
        default:
            return async (acc: Account) => (acc)
    }
}