
class PaymentReceipt {
    #id = null
    #reference = null
    #method = null
    #linkReference = null
    #file = null

    #validationNoteId = null
    #validationNoteValidated = null
    #validationNoteMessage = null
    #validationNoteDate = null

    get id() {
        return this.#id;
    }

    set id(value) {
        this.#id = value;
    }

    get reference() {
        return this.#reference;
    }

    set reference(value) {
        this.#reference = value;
    }

    get method() {
        return this.#method;
    }

    set method(value) {
        this.#method = value;
    }

    get linkReference() {
        return this.#linkReference;
    }

    set linkReference(value) {
        this.#linkReference = value;
    }

    get file() {
        return this.#file;
    }

    set file(value) {
        this.#file = value;
    }


    serialize(){
        return {
            id: this.id,
            reference: this.reference,
            method: this.method,
            linkReference: this.linkReference,
            file: this.file,

            validationNoteId: this.validationNoteId,
            validationNoteValidated: this.validationNoteValidated,
            validationNoteMessage: this.validationNoteMessage,
            validationNoteDate: this.validationNoteDate,
            validated: this.validationNoteValidated
        }
    }
}
module.exports = PaymentReceipt
