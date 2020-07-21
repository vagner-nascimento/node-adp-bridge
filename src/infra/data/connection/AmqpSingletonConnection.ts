export default class AmqpSingletonConnection {    
    public conn: any
    public isConnected: boolean
    public isAlive: boolean
    //TODO: seek a better sollution, connOnce is only to simulate sync.Once of the Golang
    public connOnce: boolean 
}
