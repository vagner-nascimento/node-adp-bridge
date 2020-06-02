export default class Merchant {
    constructor({ merchant_id, name, country }) {
        this.merhcant_id = merchant_id
        this.name = name
        this.country = country
    }
    
    public merhcant_id: string
    public name: string
    public country: string
}