import Contact from "./Contact"

export default class Seller {
    constructor({ 
        id,
        name,
        legal_document,
        last_payment_date,
        is_active,
        merchant_id,
        merchant_account_id,
        updated_date,
        contacts = []
    }) {
        this.id = id
        this.name = name
        this.legal_document = legal_document
        this.last_payment_date = last_payment_date
        this.is_active = is_active
        this.merchant_id = merchant_id
        this.merchant_account_id = merchant_account_id
        this.updated_date = updated_date
        this.contacts = contacts.map(c => new Contact(c))
    }

    public id: string
    public name: string
    public legal_document: string
    public last_payment_date: Date
    public is_active: boolean
    public merchant_id: string
    public merchant_account_id: string
    public updated_date: Date
    public contacts: Contact[]
}