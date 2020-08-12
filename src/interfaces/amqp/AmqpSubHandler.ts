export default interface AmqpSubHandler {
    subscribeConsumer(
        topic: string,
        consumer: string,
        onSuccess: (req: any) => Promise<void>
    ): Promise<void>
}
