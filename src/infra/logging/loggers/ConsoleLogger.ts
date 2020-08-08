import Logger from '../Logger'

import { getFormattedMsg, getStringifiedData } from '../LogFormatter'

export default class ConsoleLogger implements Logger {
    public error(msg: string, err: Error): void {
        console.error(getFormattedMsg(msg), err ? err : '')
    }

    public info(msg: string, data?: any): void {
        console.info(getFormattedMsg(msg), getStringifiedData(data))
    }

    public warn(msg: string, data?: any): void {
        console.warn(getFormattedMsg(msg), getStringifiedData(data))
    }
}
