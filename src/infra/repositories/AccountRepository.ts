import RabbitConnection from "../data/rabbitmq/RabbitConnection"

//TODO realise how to import using relative path (src/.../.../Etc) with NODE_PATH=.
import AccountDataHandler from '../../app/interfaces/AccountDataHandler';

import MerchantRestClient from '../../integration/http/MerchantRestClient';

import Account from '../../app/entities/Account';
import Merchant from '../../app/entities/Merchant';

// TODO put infos into app confs
export class AccountRepository implements AccountDataHandler {
    constructor() {
        this.merchantClient = new MerchantRestClient({ baseUrl: "http://localhost:4000/merchants", timeout: 10000 })
    }

    private merchantClient: MerchantRestClient

    async Save(acc: Account): Promise<Account> {
        const conn = await RabbitConnection.getInstance()

        await conn.publish("q-account", JSON.stringify(acc))
        
        console.log("account saved ", acc)

        return acc
    }

    async GetMerchant(merchanId: string): Promise<Merchant> {
        return await this.merchantClient.getMerchant(merchanId)
    }
}