import RabbitConnection from "../data/rabbitmq/RabbitConnection"

import AccountDataHandler from '../../app/interfaces/AccountDataHandler';

import { Account } from '../../app/entities/Account';

// TODO put queue into app configs
export class AccountRepository implements AccountDataHandler {
    async Save(acc: Account): Promise<Account> {
        const conn = await RabbitConnection.getInstance()

        await conn.publish("q-account", acc.toString())
        
        console.log("account saved ", acc)
        
        return acc
    }
}