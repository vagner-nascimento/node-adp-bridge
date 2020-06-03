export default class MerchantAccount {
    constructor({ merchant_id, name, number }){
        this.merchant_id = merchant_id
        this.name = name
        this.number = number
    }

    public merchant_id: string
    public name: string
    public number: string
}