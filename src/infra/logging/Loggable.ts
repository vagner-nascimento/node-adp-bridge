import logger from './Logger'

export default abstract class Loggable {
    constructor(className: string) {
        this.className = className
    }

    private className: string

    protected logInfo(msg: string, data: any = null, fnName: string = null): void {
        logger.info(`${this.className}${fnName ? `.${fnName}` : ''} - ${msg}`, data)
    }

    protected logError(msg: string, err: Error = null, fnName: string = null): void {
        logger.error(`${this.className}${fnName ? `.${fnName}` : ''} - ${msg}`, err)
    }
}
