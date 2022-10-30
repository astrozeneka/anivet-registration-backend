
class TestType {
    #id = null
    #label = null
    #slug = null
    #description = null
    #imageId = null

    get id() {
        return this.#id;
    }

    set id(value) {
        this.#id = value;
    }

    get label() {
        return this.#label;
    }

    set label(value) {
        this.#label = value;
    }

    get slug() {
        return this.#slug;
    }

    set slug(value) {
        this.#slug = value;
    }

    get description() {
        return this.#description;
    }

    set description(value) {
        this.#description = value;
    }

    get imageId() {
        return this.#imageId;
    }

    set imageId(value) {
        this.#imageId = value;
    }
}
module.exports = TestType
