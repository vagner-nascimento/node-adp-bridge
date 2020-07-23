import { Affiliation, Merchant, Account, AccountType, MerchantAccount } from "../entities"

import AccountDataHandler from "../interfaces/AccountDataHandler"

const getSellerEnrichAccount = (acc: Account, merchant: Merchant, mAcc: MerchantAccount): Account => {
    const lAcc = Object.assign({}, acc)

    if(merchant) lAcc.country = merchant.country
    if(mAcc) lAcc.financial_accounts = [mAcc]

    return lAcc
}

const getMerchantEnrichAccount = (acc: Account, mAcc: MerchantAccount[], aff: Affiliation): Account => {
    const lAcc = Object.assign({}, acc)

    if(Array.isArray(mAcc)) lAcc.financial_accounts = mAcc
    if(aff) lAcc.legal_document = aff.legal_document

    return lAcc
}

export default async (acc: any, repo: AccountDataHandler, originEntity: any): Promise<Account> => {
    switch(acc.type) {
        case AccountType.SELLER:            
            const mPromise: Promise<any> = repo.getMerchant(originEntity.merchant_id)
            const mAccPromise: Promise<any> = repo.getMerchantAccount(originEntity.merchant_account_id)

            const selRes = await Promise.all([mPromise, mAccPromise].map(p => p.catch(e => e)))
            
            let merchant = selRes[0]
            let selMAcc = selRes[1]

            if(merchant instanceof Error) merchant = null
            if(selMAcc instanceof Error) selMAcc = null

            return getSellerEnrichAccount(acc, merchant, selMAcc)
        case AccountType.MERCHANT:
            const accPromise: Promise<any> = repo.getMerchantAccounts(acc.id)
            const affPromise: Promise<any> =  repo.getMerchantAffiliation(acc.id)
                    
            const res = await Promise.all([accPromise, affPromise].map(p => p.catch(e => e)))

            let merAccs = res[0]
            let merAff = res[1]
                
            if(merAccs instanceof Error) merAccs = []
            if(merAff instanceof Error) merAff = null

            return getMerchantEnrichAccount(acc, merAccs, merAff)
        default:
            return acc
 }

}