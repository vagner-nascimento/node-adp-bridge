export default interface Subscriber {
    getConnStr(): string,
    getTopic(): string,
    getConsumer(): string,
    getAutoComplete(): boolean,
    handleMessage(msgRequest: any): Promise<void>
}
