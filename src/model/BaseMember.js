const BaseUser = require("./BaseUser");


class BaseMember extends BaseUser{
    #id = null
    #username = null
    #password = null
    #website = null
    #subscribe = null

    get id() {
        return this.#id;
    }

    set id(value) {
        this.#id = value;
    }

    get username() {
        return this.#username;
    }

    set username(value) {
        this.#username = value;
    }

    get password() {
        return this.#password;
    }

    set password(value) {
        this.#password = value;
    }

    get website() {
        return this.#website;
    }

    set website(value) {
        this.#website = value;
    }

    get subscribe() {
        return this.#subscribe;
    }

    set subscribe(value) {
        this.#subscribe = value;
    }
}
module.exports = BaseMember