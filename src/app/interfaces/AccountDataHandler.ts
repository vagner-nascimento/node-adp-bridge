import { Account, Merchant, MerchantAccount, Affiliation } from "../entities"

export default interface AccountDataHandler {
    Save(acc: Account): Promise<Account>
    GetMerchant(merchantId: string): Promise<Merchant>
    GetMerchantAccounts(merchantId: string): Promise<MerchantAccount[]>
    GetMerchantAccount(accId: string): Promise<MerchantAccount>
    GetMerchantAffiliation(merchantId: string): Promise<Affiliation>
}