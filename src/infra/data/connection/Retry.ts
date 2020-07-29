export default class Retry {
    constructor(msToSleep: number, maxRetries: number) {
        this.msToSleep = msToSleep
        this.maxTries = maxRetries
    }

    public msToSleep: number
    public maxTries: number
}
