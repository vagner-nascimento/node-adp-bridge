export default class MerchantAccount {
    constructor({ id, name, number, merchant_id }){
        this.id = id
        this.name = name
        this.number = number
        this.merchant_id = merchant_id
    }

    public id: string
    public name: string
    public number: string
    public merchant_id: string
}