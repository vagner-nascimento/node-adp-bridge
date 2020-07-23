import { Account, Merchant, MerchantAccount, Affiliation } from "../entities"

export default interface AccountDataHandler {
    save(acc: Account): Promise<Account>
    getMerchant(merchantId: string): Promise<Merchant>
    getMerchantAccounts(merchantId: string): Promise<MerchantAccount[]>
    getMerchantAccount(accId: string): Promise<MerchantAccount>
    getMerchantAffiliation(merchantId: string): Promise<Affiliation>
}