import Account from '../entities/Account';
import Merchant from '../entities/Merchant';

export default interface AccountDataHandler {
    Save(acc: Account): Promise<Account>
    GetMerchant(merchanId: string): Promise<Merchant>
}