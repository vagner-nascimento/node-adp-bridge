import { Affiliation, Merchant, Account, AccountType, MerchantAccount } from "../entities"

import { safeExec } from "../../tools/Async"

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

export function getEnrichmentStrategy(accTyp: string, repo: AccountDataHandler, originEntity: any): Function {
    switch(accTyp) {
        case AccountType.SELLER:
            return async (acc: Account) => {
                const mPromise = safeExec(repo.GetMerchant(originEntity.merchant_id))
                const mAccPromise = safeExec(repo.GetMerchantAccount(originEntity.merchant_account_id))

                return Promise.all([mPromise, mAccPromise])
                    .then(res => {
                        let merchant = res[0]
                        if(merchant instanceof Error) merchant = null

                        let mAcc = res[1]
                        if(mAcc instanceof Error) mAcc = null

                        return getSellerEnrichAccount(acc, merchant, mAcc)
                    })
            }
        case AccountType.MERCHANT:
            return async (acc: Account) => {
                const accPromise = safeExec(repo.GetMerchantAccounts(acc.id))
                const affPromise = safeExec(repo.GetMerchantAffiliation(acc.id))
                    
                return Promise.all([accPromise, affPromise])
                    .then(res => {
                        let mAcc = res[0]
                        if(mAcc instanceof Error) mAcc = []

                        let aff = res[1]
                        if(aff instanceof Error) aff = null

                        return getMerchantEnrichAccount(acc, mAcc, aff)
                    })
            }
        default:
            return async (acc: Account) => (acc)
    }
}