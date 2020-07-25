import logger from "./"

export default abstract class Loggable {
    constructor(className: string) {
        this.className = className
    }

    private className: string

    protected logInfo(msg: string, data: any = null) {
        logger.info(`${this.className} - ${msg}`, data)
    }

    protected logError(msg: string, err: Error = null) {
        logger.error(`${this.className} - ${msg}`, err)
    }
}
