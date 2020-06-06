export default class Contact {
    constructor({ id, name, phone, email }) {
        this.id = id
        this.name = name
        this.phone = phone
        this.email = email
    }

    public id: string
    public name: string
    public phone: string
    public email: string
}