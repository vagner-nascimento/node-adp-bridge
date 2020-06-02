import RabbitConnection from "../data/rabbitmq/RabbitConnection"

//TODO realise how to import using relative path (src/.../.../Etc) with NODE_PATH=.
import AccountDataHandler from '../../app/interfaces/AccountDataHandler';

import Account from '../../app/entities/Account';

// TODO put infos into app confs
export class AccountRepository implements AccountDataHandler {
    async Save(acc: Account): Promise<Account> {
        const conn = await RabbitConnection.getInstance()

        await conn.publish("q-account", JSON.stringify(acc))
        
        console.log("account saved ", acc)

        return acc
    }
}