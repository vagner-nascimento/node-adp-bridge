import events from "events"

import AppEvent from './AppEventsEnum';

class AppEventEmiter {
    constructor(){
        this.eventEmiter = new events.EventEmitter()
    }

    private eventEmiter: events.EventEmitter
    
    public addListener(event: AppEvent, handler: (...args: any[]) => void): events.EventEmitter {
        return this.eventEmiter.addListener(event, handler)
    }

    public emit(event: AppEvent, ...args: any[]): boolean {
        return this.eventEmiter.emit(event, args)
    }
}

export default new AppEventEmiter()
