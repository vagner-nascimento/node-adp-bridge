export async function safeExec(p: Promise<any>): Promise<any> {
    try {
        return await p
    } catch(err) {
        return err
    }
}