import Account from '../entities/Account';
import Merchant from '../entities/Merchant';
import MerchantAccount from '../entities/MerchantAccount';

export default interface AccountDataHandler {
    Save(acc: Account): Promise<Account>
    GetMerchant(merchanId: string): Promise<Merchant>
    GetMerchantAccounts(merchantId: string): Promise<MerchantAccount[]>
    GetMerchantAccount(accId: string): Promise<MerchantAccount>
}