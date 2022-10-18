const MessageDAO = require("../dao/crud/MessageDAO");

class FeedBL {
    static instance = null;
    static getInstance(){
        if(this.instance == null) {
            this.instance = new FeedBL()
        }
        return this.instance
    }
    static tearDown(){
        this.instance = null;
    }

    async loadView(view, offset, limit){
        return await MessageDAO.getInstance().getAll(view, offset, limit)
    }

    registration = {}
    site = {}
    process = {}
    message = {}
}
module.exports = FeedBL
