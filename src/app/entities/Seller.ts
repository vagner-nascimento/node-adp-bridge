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

    id: string
    name: string
    legal_document: string
    last_payment_date: Date
    is_active: boolean
    merchant_id: string
    merchant_account_id: string
    updated_date: Date
    contacts: Contact[]
}