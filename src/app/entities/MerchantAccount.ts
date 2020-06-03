export default class MerchantAccount {
    constructor({ merchant_id, name, number, id }){
        this.merchant_id = merchant_id
        this.name = name
        this.number = number
        this.id = id
    }

    public merchant_id: string
    public name: string
    public number: string
    public id: string
}