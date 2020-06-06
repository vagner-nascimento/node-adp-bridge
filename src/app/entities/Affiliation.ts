export default class Affiliation {
    constructor({ id, merchant_id, legal_document }) {
        this.id = id
        this.merchant_id = merchant_id
        this.legal_document = legal_document
    }

    public id: string
    public merchant_id: string
    public legal_document: string
}