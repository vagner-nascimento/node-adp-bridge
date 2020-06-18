export default class Merchant {
    constructor({ id, name, country, updated_date, is_active, billing_day, credit_limit }) {
        this.id = id
        this.name = name
        this.country = country
        this.updated_date = updated_date
        this.billing_day = billing_day
        this.is_active = is_active
        this.credit_limit = credit_limit
    }
    
    id: string
    name: string
    country: string
    updated_date: Date
    billing_day: number
    is_active: boolean
    credit_limit: number
}