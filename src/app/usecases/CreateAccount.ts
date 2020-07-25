import { isObject, isString } from "../../tools/Comparator"

import { Seller, Account, Merchant } from "../entities"
import { makeAccountFromMerchant, makeAccountFromSeller } from "../entities/Account"

const isValidData = data => isObject(data) && hasRequiredId(data)

const hasRequiredId = data => isValidId(data.id)

const isValidId = id => isString(id) && id.length > 0

const isMerchant = data => !("merchant_id" in data)

export default (data: any): Account => {
    if(isValidData(data)) {
        if(isMerchant(data)) {
            const merchant = new Merchant(data)
            return makeAccountFromMerchant(merchant)
        }

        const seller = new Seller(data)
        return makeAccountFromSeller(seller)
    }

    throw new Error(`CreateAccount - invalid data`)
}