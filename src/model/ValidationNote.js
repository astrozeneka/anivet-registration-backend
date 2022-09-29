

class ValidationNote{
    #id = null
    #validated = false
    #message = null
    #date = null

    get id() {
        return this.#id;
    }

    set id(value) {
        this.#id = value;
    }

    get validated() {
        return this.#validated;
    }

    set validated(value) {
        this.#validated = value;
    }

    get message() {
        return this.#message;
    }

    set message(value) {
        this.#message = value;
    }

    get date() {
        return this.#date;
    }

    set date(value) {
        this.#date = value;
    }

    serialize(){
        return {
            id: this.id,
            validated: this.validated,
            message: this.message,
            date: this.date
        }
    }
}
module.exports = ValidationNote
