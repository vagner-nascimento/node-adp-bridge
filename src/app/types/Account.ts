import Contact from './Contact'
import AccountType from './AccountType'
import MerchantAccount from './MerchantAccount'

// TODO add setter to date types
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
    public country: string = null
    public billing_day: number = null
    public is_active: boolean = null
    public credit_limit: number = null
    public merchant_accounts: MerchantAccount[] = []
    public contacts: Contact[] = []
    public update_date: Date = null
    public last_payment_date: Date = null

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
    
    public setLegalDocument(legal_document: string): Account {
        this.legal_document = legal_document
        return this
    }
    
    public setCountry(country: string): Account {
        this.country = country
        return this
    }
    
    public setBillingDay(day: number): Account {
        this.billing_day = day
        return this
    }
    
    public setIsActive(active: boolean): Account {
        this.is_active = active
        return this
    }

    public setCreditLimit(credit: number) {
        this.credit_limit = credit
        return this
    }

    public setMerchantAccounts(accounts: MerchantAccount[]): Account {
        for(const acc of accounts) this.merchant_accounts.push(acc)
        return this
    }

    public setContacts(contacts: Contact[]): Account {
        for(const c of contacts) this.contacts.push(c)
        return this
    }
}
