import { getAccountAdapter } from "../../../provider/Provider"

import Account from "../../../app/entities/Account"
import logger from "../../../infra/logger"
import ApplicationError from "../../../error/ApplicationError"

export default async function(data: any): Promise<Account> {
    try{
        const accAdp = getAccountAdapter()   
        
        return await accAdp.addAccount(JSON.parse(data))
    } catch(err) {
        logger.error("error on create a new account", err)
        
        throw new ApplicationError("error on create a new account", err)
    }
}
