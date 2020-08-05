export function safeResolvePromises(promises: Promise<any>[]) {
    return Promise.all(promises.map(p => p.catch(err => err)))
}
