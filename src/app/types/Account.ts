import Contact from "./Contact"
import AccountType from "./AccountTypeEnum"

export default class Account {
    private constructor(type: AccountType) {
        this.type = type
    }

    public type: AccountType
    public id: string
    public name: string = null
    public merchant_id: string = null
    public merchant_account_id: string = null 
    public legal_document: string = null
    // public merchant_accounts: string // TODO: create merchant acc type
    public country: string = null
    public update_date: Date = null
    public last_payment_date: Date = null
    public billing_day: number = null
    public is_active: boolean = null
    public credit_limit: number = null
    public contacts: Contact[] = []

    public static build(type: AccountType): Account {
        return new Account(type)
    }

    public setId(id: string): Account {
        this.id = id
        return this
    }

    public setName(name: string): Account {
        this.name = name
        return this
    }
    
    public setMerchantId(id: string): Account {
        this.merchant_id = id
        return this
    }

    public setMerchantAccountId(id: string): Account {
        this.merchant_account_id = id
        return this
    }

    public setContacts(contacts: Contact[]): Account {
        for(const c of contacts) this.contacts.push(c)
        return this
    }
}
