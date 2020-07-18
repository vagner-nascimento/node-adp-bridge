import ApplicationError from "../../error/ApplicationError"

import { isNullOrUndefined } from "../../tools/Comparator"

class Logger {
    error(msg: string, err: Error): void {
        switch(err.constructor.name) {
            case ApplicationError.name: {
                let {
                    message: errMsg,
                    originError,
                    details
                } = <ApplicationError> err
                    
                if(!originError) originError = new Error("none error")

                if(isNullOrUndefined(details)) details = "none details"
                else if(typeof details === "object") details = JSON.stringify(details)
                    
                err = new Error(`${errMsg} - original error: ${originError}, details ${details.toString()}`)
            }
            break
        }

        console.error(this.getFormattedMsg(msg), err)
    }

    info(msg: string, data: any = null): void {
        if(isNullOrUndefined(data)) data = ""
        
        console.info(this.getFormattedMsg(msg), data)
    }

    private getFormattedMsg(msg: string): string {
        return `${new Date().toISOString().replace("T"," ")} - ${msg}`
    }
}

export default new Logger()
