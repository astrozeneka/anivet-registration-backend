
/*
* Have a ONE-to-many relationship with the sample
* so, ไม่มี dao
*/
class TrackingType {
    #id = null
    #label = null

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

    serialize(){
        return {
            id: this.id,
            label: this.label
        }
    }
}
module.exports = TrackingType
