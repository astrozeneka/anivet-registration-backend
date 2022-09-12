const BaseBL = require("./BaseBL");
const MessageDAO = require("../dao/MessageDAO");

class MemberBL extends BaseBL {
    static instance = null;
    static getInstance(){
        if(this.instance == null) {
            this.instance = new MemberBL()
        }
        return this.instance
    }
    static tearDown(){
        this.instance = null;
    }

    constructor(){
        super();
    }

    async messageList(user){
        let output = await MessageDAO.getInstance().getAllReceivedBy(user.id)
        return output
    }

    async submitMessage(message){
        return await MessageDAO.getInstance().add(message)
    }
}
module.exports = MemberBL
