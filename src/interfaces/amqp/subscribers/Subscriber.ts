export default interface Subscriber {
    getConnStr(): string,
    getTopic(): string,
    getConsumer(): string,
    getAutoComplete(): boolean,
    getHandler(): (message: any) => Promise<any>
}
