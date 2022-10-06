/**
 * TestResult,
 * Certification,
 * Any other related documents can be
 * inherited from this class
 */
class SciDoc{
    #id = null
    #reference = null
    #type = null
    #testSampleId = null
    #triggererId = null
    #date = null
    #file = null

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

    get type() {
        return this.#type;
    }

    set type(value) {
        this.#type = value;
    }

    get testSampleId() {
        return this.#testSampleId;
    }

    set testSampleId(value) {
        this.#testSampleId = value;
    }

    get triggererId() {
        return this.#triggererId;
    }

    set triggererId(value) {
        this.#triggererId = value;
    }

    get date() {
        return this.#date;
    }

    set date(value) {
        this.#date = value;
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
            type: this.type,
            testSampleId: this.testSampleId,
            triggererId: this.triggererId,
            date: this.date,
            file: this.file
        }
    }
}
module.exports = SciDoc
