import { getAccountAdatapter } from '../../../provider/Provider';

import Account from '../../../app/entities/Account';

export default async function(data: any): Promise<Account> {
    const accAdp = getAccountAdatapter()    
    const dataObj = JSON.parse(data)
    
    return await accAdp.addAccount(dataObj)
}