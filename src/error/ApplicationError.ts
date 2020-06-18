export default class ApplicationError implements Error {
    constructor(msg: string, originErr: Error = null, details: any = null){
        this.message = msg
        this.originError = originErr
        this.details = details
    }

    name: string
    message: string
    stack?: string
    originError: Error
    details: any
}
