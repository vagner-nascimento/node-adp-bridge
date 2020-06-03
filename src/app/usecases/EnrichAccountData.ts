import Merchant from '../entities/Merchant';
import Account from '../entities/Account';
import AccountType from '../entities/AccountType';
import MerchantAccount from '../entities/MerchantAccount';

import AccountDataHandler from '../interfaces/AccountDataHandler';

const enrichSellerAccount = (acc: Account, merchant: Merchant): Account => {
    const lAcc = Object.assign({}, acc)    
    if(merchant instanceof Merchant)
        lAcc.country = merchant.country

    return lAcc
}

const enrichMerchantAccount = (acc: Account, mAccs: MerchantAccount[]): Account => {
    const lAcc = Object.assign({}, acc)
    if(Array.isArray(mAccs)) lAcc.financial_accounts = mAccs

    return lAcc
}

export function getEnrichmentStrategy(accTyp: string, repo: AccountDataHandler): any {
    switch(accTyp) {
        case AccountType.SELLER:
            return async (acc: Account) => {
                try {
                    const merchant = await repo.GetMerchant(acc.merchant_id)

                    return enrichSellerAccount(acc, merchant)
                } catch {
                    return acc
                }
            }
        case AccountType.MERCHANT:
            return async (acc: Account) => {
                try {
                    const mAccs = await repo.GetMerchantAccounts(acc.id)
                    return enrichMerchantAccount(acc, mAccs)
                } catch {
                    return acc
                }
            }
        default:
            return async (acc: Account) => (acc)
    }
}