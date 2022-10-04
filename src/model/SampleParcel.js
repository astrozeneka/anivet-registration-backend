
class SampleParcel{

    #id = null
    #reference = null
    #deliveryService = null
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

    get deliveryService() {
        return this.#deliveryService;
    }

    set deliveryService(value) {
        this.#deliveryService = value;
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
            deliveryService: this.deliveryService,
            testSampleId: this.testId,
            triggererId: this.triggererId,
            date: this.date,
            file: this.file

            // Related properties will be added here
        }
    }
}
module.exports = SampleParcel
