export default class Merchant {
    constructor({ id, name, country, billing_day, is_active, credit_limit, updated_date }) {
        this.id = id
        this.name = name
        this.country = country
        this.updated_date = updated_date
        this.billing_day = billing_day
        this.is_active = is_active
        this.credit_limit = credit_limit
    }

    public id: string
    public name: string
    public country: string
    public updated_date: Date
    public is_active: boolean
    public billing_day: number
    public credit_limit: number
}
