export default class Seller {
    constructor({ seller_id, name, merchant_id}) {
        this.seller_id = seller_id
        this.name = name
        this.merchant_id = merchant_id
    }
    
    public seller_id: string
    public name: string
    public merchant_id: string
}