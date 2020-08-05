import Account from '../types/Account'
import MerchantAccount from '../types/MerchantAccount';

export default interface AccountDataHandler {
    save(acc: Account): Promise<Account>
    getMerchantAccount(id: string): Promise<MerchantAccount>
    getMerchantAccounts(merchantId: string): Promise<MerchantAccount[]>
}
