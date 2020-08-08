import { createAccountFromMerchant, createAccountFromSeller } from '../entities/AccountEnt'
import { safeResolvePromises } from '../../async'

import Account from '../types/Account'
import Merchant from '../types/Merchant'
import Seller from '../types/Seller'
import AccountType from '../types/AccountType'

import ApplicationError from '../../error/ApplicationError'

import AccountDataHandler from '../handlers/AccountDataHandler'
import MerchantAccount from '../types/MerchantAccount'
import Affiliation from '../types/Affiliation'

export function createAccount(entity: any): Account {
    if(entity instanceof Merchant) return createAccountFromMerchant(entity)
    else if(entity instanceof Seller) return createAccountFromSeller(entity)
    else throw new ApplicationError('invalid type to create an Account')
}

export async function enrichAccount(acc: Account, repo: AccountDataHandler): Promise<Account> {
    //TODO: move specif enrichments to its properly use cases
    if(acc.type === AccountType.SELLER) {
        const results = await safeResolvePromises([
            repo.getMerchantAccount(acc.merchant_account_id),
            repo.getMerchant(acc.merchant_id)
        ])

        let merAcc: MerchantAccount = results[0]
        let mer: Merchant = results[1]

        if(merAcc && !(merAcc instanceof Error)) acc.setMerchantAccounts([merAcc])
        if(mer && !(mer instanceof Error)) acc.setCountry(mer.country)
    } else if(acc.type === AccountType.MERCHANT) {
        const results = await safeResolvePromises([
            repo.getMerchantAccounts(acc.id),
            repo.getAffiliation(acc.id)
        ])

        let merAccs: MerchantAccount[] = results[0]
        let aff: Affiliation = results[1]

        if(merAccs && !(merAccs instanceof Error)) acc.setMerchantAccounts(merAccs)
        if(aff && !(aff instanceof Error)) acc.setLegalDocument(aff.legal_document)
    }

    return acc
}
