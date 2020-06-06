import Seller from "./Seller"
import Merchant from "./Merchant"
import AccountType from "./AccountType"
import MerchantAccount from "./MerchantAccount"
import Contact from "./Contact"

export default class Account {
    constructor(
        type: string,
        id: string,
        name: string,
        updated_date: Date,
        is_active: boolean,
        last_payment_date: Date = null,
        merchant_id: string = null,
        legal_document: string = null,
        contacts: Contact[] = [],
        country: string = null,
        billing_day: number = null,
        credit_limit: number = null
    ) {
        this.type = type
        this.id = id
        this.name = name
        this.updated_date = updated_date
        this.is_active = is_active
        this.last_payment_date = last_payment_date
        this.merchant_id = merchant_id
        this.legal_document = legal_document
        this.contacts = contacts
        this.country = country
        this.billing_day = billing_day
        this.financial_accounts = []
        this.credit_limit = credit_limit
    }

    public type: string
    public id: string
    public name: string
    public updated_date: Date
    public is_active: boolean
    public last_payment_date: Date
    public merchant_id: string
    public legal_document: string
    public contacts: Contact[]
    public country: string
    public billing_day: number
    public financial_accounts: MerchantAccount[]
    public credit_limit: number
}

export function makeAccountFromMerchant(merchant: Merchant): Account {
    return new Account(
        AccountType.MERCHANT,
        merchant.id,
        merchant.name,
        merchant.updated_date,
        merchant.is_active,
        null,
        null,
        null,
        [],
        merchant.country,
        merchant.billing_day,
        merchant.credit_limit
    )
}

export function makeAccountFromSeller(seller: Seller): Account {
    return new Account(
        AccountType.SELLER,
        seller.id,
        seller.name,
        seller.updated_date,
        seller.is_active,
        seller.last_payment_date,
        seller.merchant_id,
        seller.legal_document,
        seller.contacts,
        null,
        null,
        null
    )
}