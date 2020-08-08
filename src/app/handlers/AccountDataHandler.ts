import Account from '../types/Account'
import MerchantAccount from '../types/MerchantAccount';
import Merchant from '../types/Merchant';
import Affiliation from '../types/Affiliation';

export default interface AccountDataHandler {
    save(acc: Account): Promise<Account>
    getMerchant(id: string): Promise<Merchant>
    getMerchantAccount(id: string): Promise<MerchantAccount>
    getMerchantAccounts(merchantId: string): Promise<MerchantAccount[]>
    getAffiliation(id: string): Promise<Affiliation>
}
