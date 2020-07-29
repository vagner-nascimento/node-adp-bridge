import logger from "."

export default abstract class LoggerHandler {
    constructor(className: string) {
        this.className = className
    }

    private className: string

    protected logInfo(msg: string, data: any = null, funcName: string = null) {
        logger.info(this.getLogMsg(msg, funcName), data)
    }

    protected logError(msg: string, err: Error = null, funcName: string = null) {
        logger.info(this.getLogMsg(msg, funcName), err)
    }

    private getLogMsg(msg: string, funcName: string): string {
        let logMsg = `${this.className}`
        
        if(funcName) logMsg += `.${funcName}`
        
        logMsg += ` - ${msg}`

        return logMsg
    }
}
