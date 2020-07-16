export default class Contact {
    constructor({ id, name, phone, email }) {
        this.id = id
        this.name = name
        this.phone = phone
        this.email = email
    }

    id: string
    name: string
    phone: string
    email: string
}