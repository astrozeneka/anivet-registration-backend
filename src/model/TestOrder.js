
class TestOrder{

    #id = null
    #name1 = null
    #name2 = null
    #website = null
    #email = null
    #memberId = null

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

    get name1() {
        return this.#name1;
    }

    set name1(value) {
        this.#name1 = value;
    }

    get name2() {
        return this.#name2;
    }

    set name2(value) {
        this.#name2 = value;
    }

    get website() {
        return this.#website;
    }

    set website(value) {
        this.#website = value;
    }

    get email() {
        return this.#email;
    }

    set email(value) {
        this.#email = value;
    }

    get memberId() {
        return this.#memberId;
    }

    set memberId(value) {
        this.#memberId = value;
    }

    get validationNoteId() {
        return this.#validationNoteId;
    }

    set validationNoteId(value) {
        this.#validationNoteId = value;
    }

    get validationNoteValidated() {
        return this.#validationNoteValidated;
    }

    set validationNoteValidated(value) {
        this.#validationNoteValidated = value;
    }

    get validationNoteMessage() {
        return this.#validationNoteMessage;
    }

    set validationNoteMessage(value) {
        this.#validationNoteMessage = value;
    }

    get validationNoteDate() {
        return this.#validationNoteDate;
    }

    set validationNoteDate(value) {
        this.#validationNoteDate = value;
    }

    serialize(){
        return {
            id: this.id,
            name1: this.name1,
            name2: this.name2,
            website: this.website,
            email: this.email,
            memberId: this.memberId,

            validationNoteId: this.validationNoteId,
            validationNoteValidated: this.validationNoteValidated,
            validationNoteMessage: this.validationNoteMessage,
            validationNoteDate: this.validationNoteDate,
            validated: this.validationNoteValidated
        }
    }
}

module.exports = TestOrder
