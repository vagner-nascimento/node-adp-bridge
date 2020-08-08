import logger from './'

export default abstract class Loggable {
    constructor(className: string) {
        this.className = className
    }

    private className: string

    protected logInfo(msg: string, data?: any, fnName?: string): void {
        logger.info(`${this.className}${fnName ? `.${fnName}` : ''} - ${msg}`, data)
    }

    protected logError(msg: string, err: Error, fnName?: string): void {
        logger.error(`${this.className}${fnName ? `.${fnName}` : ''} - ${msg}`, err)
    }
}
