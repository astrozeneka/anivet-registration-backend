
class TestSample{

    #id = null
    #animal = null
    #type = null
    #petId = null
    #petSpecie = null
    #test = null
    #sampleType = null
    #image = null  // An ID
    #testOrderId = null
    #trackingTypeId = null
    #progress = null

    get id() {
        return this.#id;
    }

    set id(value) {
        this.#id = value;
    }

    get animal() {
        return this.#animal;
    }

    set animal(value) {
        this.#animal = value;
    }

    get type() {
        return this.#type;
    }

    set type(value) {
        this.#type = value;
    }

    get petId() {
        return this.#petId;
    }

    set petId(value) {
        this.#petId = value;
    }

    get petSpecie() {
        return this.#petSpecie;
    }

    set petSpecie(value) {
        this.#petSpecie = value;
    }

    get test() {
        return this.#test;
    }

    set test(value) {
        this.#test = value;
    }

    get sampleType() {
        return this.#sampleType;
    }

    set sampleType(value) {
        this.#sampleType = value;
    }

    get image() {
        return this.#image;
    }

    set image(value) {
        this.#image = value;
    }


    get testOrderId() {
        return this.#testOrderId;
    }

    set testOrderId(value) {
        this.#testOrderId = value;
    }

    get trackingTypeId() {
        return this.#trackingTypeId;
    }

    set trackingTypeId(value) {
        this.#trackingTypeId = value;
    }

    get progress() {
        return this.#progress;
    }

    set progress(value) {
        this.#progress = value;
    }

    serialize(){
        return {
            id: this.id,
            animal: this.animal,
            type: this.type,
            petId: this.petId,
            petSpecie: this.petSpecie,
            test: this.test,
            sampleType: this.sampleType,
            image: this.image,
            testOrderId: this.testOrderId,
            trackingTypeId: this.trackingTypeId
        }
    }
}
module.exports = TestSample
