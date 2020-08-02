export default interface AmqpSubHandler {
    subscribeConsumer(
        topic: string,
        consumer: string,
        onSuccess: (req: any) => Promise<void>,
        onError: (err: Error) => void
    ): Promise<void>
}
