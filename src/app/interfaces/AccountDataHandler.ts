import Account from '../entities/Account';

export default interface AccountDataHandler {
    Save(acc: Account): Promise<Account>
}