
class Message {
    #id = null
    #tags = null
    #title = null
    #content = null
    #senderId = null
    #receiverId = null
    #date = null
    #read = null

    get id() {
        return this.#id;
    }

    set id(value) {
        this.#id = value;
    }

    get tags() {
        return this.#tags;
    }

    set tags(value) {
        this.#tags = value;
    }

    get title() {
        return this.#title;
    }

    set title(value) {
        this.#title = value;
    }

    get content() {
        return this.#content;
    }

    set content(value) {
        this.#content = value;
    }

    get senderId() {
        return this.#senderId;
    }

    set senderId(value) {
        this.#senderId = value;
    }

    get receiverId() {
        return this.#receiverId;
    }

    set receiverId(value) {
        this.#receiverId = value;
    }

    get date() {
        return this.#date;
    }

    set date(value) {
        this.#date = value;
    }

    get read() {
        return this.#read;
    }

    set read(value) {
        this.#read = value;
    }

    serialize(){
        return {
            id: this.id,
            tags: this.tags,
            title: this.title,
            content: this.content,
            senderId: this.senderId,
            receiverId: this.receiverId,
            date: this.date,
            read: this.read
        }
    }
}
module.exports = Message
