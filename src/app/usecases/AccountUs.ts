import Account from "../types/Account";

import { createAccountFromMerchant, createAccountFromSeller } from '../entities/AccountEnt';

import Merchant from '../types/Merchant';
import Seller from '../types/Seller';

import ApplicationError from '../../error/ApplicationError';

export function createAccount(entity: any): Account {
    if(entity instanceof Merchant) return createAccountFromMerchant(entity);
    else if(entity instanceof Seller) return createAccountFromSeller(entity);
    else throw new ApplicationError("invalid type to create an Account");    
}
