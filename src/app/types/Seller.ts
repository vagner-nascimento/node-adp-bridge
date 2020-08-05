import Contact from './Contact'

export default class Seller {
    constructor({
        id,
        merchant_id,
        merchant_account_id,
        name,
        legal_document,
        is_active,
        last_payment_date,
        updated_date,
        contacts
    }) {
        this.id = id
        this.merchant_id = merchant_id
        this.merchant_account_id = merchant_account_id
        this.name = name
        this.legal_document = legal_document
        this.is_active = is_active
        this.last_payment_date = last_payment_date
        this.updated_date = updated_date

        for(const c of contacts)
            this.contacts.push(new Contact(c))
    }

    public id: string
    public merchant_id: string
    public merchant_account_id: string
    public name: string
    public legal_document: string
    public is_active: boolean
    public last_payment_date: Date
    public updated_date: Date
    public contacts: Contact[] = []
}
