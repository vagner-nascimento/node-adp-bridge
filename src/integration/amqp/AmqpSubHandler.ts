import Subsciber from './Subscriber';

export default interface AmqpSubHandler {
    subscibeConsumers(subs: Subsciber[])
}
