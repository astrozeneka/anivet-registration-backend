const BaseUser = require("./BaseUser");


class BaseMember extends BaseUser{
    #id = null
    #username = null
    #password = null
    #website = null
    #subscribe = null

    #name1 = null
    #name2 = null
    #phone = null
    #email = null

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

    get phone() {
        return this.#phone;
    }

    set phone(value) {
        this.#phone = value;
    }

    get email() {
        return this.#email;
    }

    set email(value) {
        this.#email = value;
    }
}
module.exports = BaseMember