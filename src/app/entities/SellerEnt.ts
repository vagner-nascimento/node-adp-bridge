import Seller from '../types/Seller';

export function createSller(data: any): Seller {
    return new Seller(data);
}
