import events from "events"

import { AmqpEvents } from '../infra/data/amqp/AmqpEventsEnum';

class AppEventEmiter {
    constructor(){
        this.eventEmiter = new events.EventEmitter()
    }

    private eventEmiter: events.EventEmitter
    
    public addListener(event: AmqpEvents, handler: (...args: any[]) => void): events.EventEmitter {
        return this.eventEmiter.addListener(event, handler)
    }

    public emit(event: AmqpEvents, ...args: any[]): boolean {
        return this.eventEmiter.emit(event, args)
    }
}

export default new AppEventEmiter()
