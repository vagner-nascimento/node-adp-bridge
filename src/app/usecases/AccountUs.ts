import { createAccountFromMerchant, createAccountFromSeller } from '../entities/AccountEnt'
import { safeResolvePromises } from '../../async'

import Account from '../types/Account'
import Merchant from '../types/Merchant'
import Seller from '../types/Seller'
import AccountType from '../types/AccountType'

import ApplicationError from '../../error/ApplicationError'

import AccountDataHandler from '../handlers/AccountDataHandler'

export function createAccount(entity: any): Account {
    if(entity instanceof Merchant) return createAccountFromMerchant(entity)
    else if(entity instanceof Seller) return createAccountFromSeller(entity)
    else throw new ApplicationError('invalid type to create an Account')
}

export async function enrichAccount(acc: Account, repo: AccountDataHandler): Promise<Account> {
    if(acc.type === AccountType.SELLER) {
        //TODO: add more async calls
        const results = await safeResolvePromises([
            repo.getMerchantAccount(acc.merchant_account_id)
        ])

        let merAcc = results[0]
        if(merAcc && !(merAcc instanceof Error)) acc.setMerchantAccounts([merAcc])
    } else if(acc.type === AccountType.MERCHANT) {
        //TODO: make merchant async calls
    }

    return acc
}
