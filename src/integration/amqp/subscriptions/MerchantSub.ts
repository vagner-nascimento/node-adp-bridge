import addAccount from './AddAccount'

import { Subscription } from '../../../infra/repositories/AmqpRepository';

// TODO put infos into app confs
export class MerchantSub implements Subscription {
    getTopic(): string {
        return "q-merchants"
    }

    getHandler(): any {
        return async (msg) => {
            console.log(`${this.constructor.name} - message received on topic ${this.getTopic()}: `, msg.content.toString())

            try{
                await addAccount(msg.content)
            } catch(err) {
                console.log(`${this.constructor.name} - error on process message `, err)
            }
        }
    }
}