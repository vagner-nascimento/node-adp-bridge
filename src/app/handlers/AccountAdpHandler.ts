import Account from '../types/Account'

export default interface AccountAdpHandler {
    addAccount(entity: any): Promise<Account>
}
