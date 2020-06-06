import Merchant from "../entities/Merchant"
import Account from "../entities/Account"
import AccountType from "../entities/AccountType"
import MerchantAccount from "../entities/MerchantAccount"

import { safeExec } from "../../tools/Async"

import AccountDataHandler from "../interfaces/AccountDataHandler"

const getSellerEnrichAccount = (acc: Account, merchant: Merchant, mAcc: MerchantAccount): Account => {
    const lAcc = Object.assign({}, acc)
    if(merchant)
        lAcc.country = merchant.country

    if(mAcc)
        lAcc.financial_accounts = [mAcc]

    return lAcc
}

const getMerchantEnrichAccount = (acc: Account, mAcc: MerchantAccount[]): Account => {
    const lAcc = Object.assign({}, acc)
    if(Array.isArray(mAcc)) lAcc.financial_accounts = mAcc

    return lAcc
}

export function getEnrichmentStrategy(accTyp: string, repo: AccountDataHandler, originEntity: any): any {
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
                try {
                    // TODO: make another merchant enrich call
                    const mAcc = await repo.GetMerchantAccounts(acc.id)

                    return getMerchantEnrichAccount(acc, mAcc)
                } catch {
                    return acc
                }
            }
        default:
            return async (acc: Account) => (acc)
    }
}