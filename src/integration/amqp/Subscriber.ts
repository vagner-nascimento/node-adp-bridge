export default interface Subsciber {
    getTopic(): string
    getConsumer(): string
    getHandler(): (msg: any) => boolean
}
