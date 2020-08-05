import config from '../../../config'

class Logger {
    constructor() {
        return this.getLogger(config)
    }

    private getLogger(conf: any): Logger {
        const logInfo = (msg: string): void => {
            console.info(`${this.constructor.name} - ${msg}`)
        }

        if(['LOCAL', 'DOCKER'].includes(conf.env)) {
            logInfo(`loading "${conf.env}": CONSOLE logger`)

            return this 
        }
        
        logInfo(`loading "${conf.env}" APP logger`)

        return this // TODO: return app logger (like grafana or winston)
    }

    public error(msg: string, err: Error = null): void {
        console.error(this.getFormattedMsg(msg), err ? err : '')
    }

    public info(msg: string, data: any = null): void {
        console.info(this.getFormattedMsg(msg), this.getStrData(data))
    }

    public warn(msg: string, data: any = null): void {
        console.warn(this.getFormattedMsg(msg), this.getStrData(data))
    }    

    private getFormattedMsg(msg: string): string {
        return `${new Date().toISOString()} - ${msg}`
    }

    private getStrData(data: any = null): string {
        return data ? JSON.stringify(data) : ''
    }
}

export default new Logger()
