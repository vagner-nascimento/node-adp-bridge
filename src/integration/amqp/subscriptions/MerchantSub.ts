import { Subscription } from '../../../infra/repositories/AmqpRepository';

// TODO put infos into app confs
// TODO develop message processment
export class MerchantSub implements Subscription {
    getTopic(): string {
        return "q-merchant"
    }

    getHandler(): any {
        return (msg) => {
            console.log(`${this.constructor.name} - message received on topic ${this.getTopic()}: `, msg.content.toString())
        }
    }
}