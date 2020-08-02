import Account from "../types/Account";

import { createAccountFromMerchant } from "../entities/AccountEnt";
import { createMerchant } from '../entities/MerchantEnt';

export function createAccount(entity: any): Account {
    // TODO: validate if is seller or merchant
    const merch = createMerchant(entity);

    return createAccountFromMerchant(merch);
}
