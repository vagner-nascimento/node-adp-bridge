export default interface Subscriber {
    getConnStr(): string,
    getTopic(): string,
    getConsumer(): string,
    getAutoComplete(): boolean,
    processMessage(msgRequest: any): Promise<void>
}
