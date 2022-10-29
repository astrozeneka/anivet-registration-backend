
class Certification {
    #id=null
    #testResultId=null
    #validationNoteId=null
    #fileId=null

    get id() {
        return this.#id;
    }

    set id(value) {
        this.#id = value;
    }

    get testResultId() {
        return this.#testResultId;
    }

    set testResultId(value) {
        this.#testResultId = value;
    }

    get validationNoteId() {
        return this.#validationNoteId;
    }

    set validationNoteId(value) {
        this.#validationNoteId = value;
    }

    get fileId() {
        return this.#fileId;
    }

    set fileId(value) {
        this.#fileId = value;
    }
}
module.exports = Certification
