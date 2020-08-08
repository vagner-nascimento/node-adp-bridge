export default interface Logger {
    error(msg: string, err: Error): void
    info(msg: string, data?: any): void
    warn(msg: string, data?: any): void
}
