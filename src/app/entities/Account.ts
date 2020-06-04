import Seller from "./Seller"
import Merchant from "./Merchant"
import AccountType from "./AccountType"
import MerchantAccount from "./MerchantAccount"

export default class Account {
    constructor(id: string, name: string, type: string, merchantId: string = null, country: string = null) {
        this.id = id
        this.name = name
        this.type = type
        this.merchant_id = merchantId
        this.country = country
        this.financial_accounts = []
    }

    public type: string
    public id: string
    public name: string
    public merchant_id: string
    public country: string
    public financial_accounts: MerchantAccount[]
}

export function makeAccountFromMerchant(merchant: Merchant): Account {
    return new Account(merchant.merhcant_id, merchant.name, AccountType.MERCHANT, null, merchant.country)
}

export function makeAccountFromSeller(seller: Seller): Account {
    return new Account(seller.seller_id, seller.name, AccountType.SELLER, seller.merchant_id)
}