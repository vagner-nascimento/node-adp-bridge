import Account from '../types/Account';

export default interface AccountDataHandler {
    save(acc: Account): Promise<Account>
}
