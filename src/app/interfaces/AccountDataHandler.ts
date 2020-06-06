import Account from "../entities/Account"
import Merchant from "../entities/Merchant"
import MerchantAccount from "../entities/MerchantAccount"
import Affiliation from "../entities/Affiliation"

export default interface AccountDataHandler {
    Save(acc: Account): Promise<Account>
    GetMerchant(merchantId: string): Promise<Merchant>
    GetMerchantAccounts(merchantId: string): Promise<MerchantAccount[]>
    GetMerchantAccount(accId: string): Promise<MerchantAccount>
    GetMerchantAffiliation(merchantId: string): Promise<Affiliation>
}