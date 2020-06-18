export default class MerchantAccount {
    constructor({ id, name, number, merchant_id }){
        this.id = id
        this.name = name
        this.number = number
        this.merchant_id = merchant_id
    }

    id: string
    name: string
    number: string
    merchant_id: string
}