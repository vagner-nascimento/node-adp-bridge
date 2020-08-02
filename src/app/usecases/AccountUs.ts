import Account from "../types/Account";

import { createAccountFromMerchant, createAccountFromSeller } from '../entities/AccountEnt';
import { createMerchant } from '../entities/MerchantEnt';

import Merchant from '../types/Merchant';
import Seller from '../types/Seller';
import { createSller } from '../entities/SellerEnt';
import ApplicationError from '../../error/ApplicationError';

export function createAccount(entity: any): Account {
    // TODO: validate if is seller or merchant
    if(entity instanceof Merchant) {
        const merch = createMerchant(entity);

        return createAccountFromMerchant(merch);
    } else if(entity instanceof Seller) {
        const sell = createSller(entity);

        return createAccountFromSeller(sell);
    } else {
        throw new ApplicationError("invalid type to create an Accont");
    }
}
