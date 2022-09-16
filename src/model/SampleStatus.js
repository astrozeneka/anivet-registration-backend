
class SampleStatus {
    #id = null
    #step = null // STep1, step2, Step3, step0 is always not registerd
    #label = null
    #trackingTypeId = null // Foreigh key

    get id() {
        return this.#id;
    }

    set id(value) {
        this.#id = value;
    }

    get step() {
        return this.#step;
    }

    set step(value) {
        this.#step = value;
    }

    get label() {
        return this.#label;
    }

    set label(value) {
        this.#label = value;
    }

    get trackingTypeId() {
        return this.#trackingTypeId;
    }

    set trackingTypeId(value) {
        this.#trackingTypeId = value;
    }

    serialize(){
        return {
            id: this.id,
            step: this.step,
            label: this.label,
            trackingTypeId: this.trackingTypeId
        }
    }
}
module.exports = SampleStatus
