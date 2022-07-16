
class TestOrder{

    #id = null
    #name1 = null
    #name2 = null
    #website = null

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

    serialize(){
        return {
            name1: this.name1,
            name2: this.name2,
            website: this.website
        }
    }
}

module.exports = TestOrder