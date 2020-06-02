import { isObject, isString } from "../../tools/Comparator"

import Seller from '../entities/Seller';
import Account from '../entities/Account'
import Merchant from '../entities/Merchant';
import { makeAccountFromMerchant, makeAccountFromSeller } from '../entities/Account';

const isValidData = data => isObject(data) && hasRequiredId(data)

const hasRequiredId = data => isValidId(data.merchant_id) || isValidId(data.seller_id)

const isValidId = id => isString(id) && id.length > 0

const isMerchant = data => !("seller_id" in data)

export default function (data: any): Account {
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