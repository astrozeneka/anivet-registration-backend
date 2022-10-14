const assertNotEmpty = require("../utils/validator/assertNotEmpty");
const lodash = require("lodash");
const BaseMemberDAO = require("../dao/crud/BaseMemberDAO");
const ValidationNote = require("../model/ValidationNote");
const TimeBL = require("./TimeBL");
const ValidationNoteDAO = require("../dao/crud/ValidationNoteDAO");
const Message = require("../model/Message");
const MessageDAO = require("../dao/MessageDAO");

class ValidationBL {

    static instance = null;
    static getInstance(){
        if(this.instance == null) {
            this.instance = new ValidationBL()
        }
        return this.instance
    }
    static tearDown(){
        this.instance = null;
    }

    // Can be inserted in a superclass
    async loadView(dao, view, offset, limit){
        return await dao.getAll(view, offset, limit)
    }

    async loadOne(dao, view, id){
        let o = await dao.getOne(view, id)
        if(o.password)
            o.password = ""
        return o
    }

    async validateRegistration(raw){
        // Validate
        let e = {}
        if(!raw.validationNoteValidated)
            assertNotEmpty(raw, "validationNoteMessage", e)
        if(!lodash.isEmpty(e))
            return {errors: e}

        // If note doesn't exists, create a new
        let m = await BaseMemberDAO.getInstance().getOne("validation_details", raw.id)
        if(m.validationNoteId == null){
            let note = new ValidationNote()
            note.message = raw.validationNoteMessage
            note.validated = raw.validationNoteValidated
            note.date = TimeBL.getInstance().time
            console.warn("In order ot advance quickly, the old DAO version is used, should be updated later")
            await ValidationNoteDAO.getInstance().add(note)

            // update user
            m.validationNoteId = note.id
            await BaseMemberDAO.getInstance().update(m)
        }else{
            // Shouldn't use linear data structure for transmitting raw data
            let note = new ValidationNote()
            note.id = m.validationNoteId
            note.message = raw.validationNoteMessage
            note.validated = raw.validationNoteValidated
            note.date = TimeBL.getInstance().time
            ValidationNoteDAO.getInstance().update(note)

            // Don't update user
        }

        // Notify User : send a message to a user that he has been validated by the admin
        m = await BaseMemberDAO.getInstance().getOne("validation_details", raw.id)
        let msg = new Message()
        msg.title = `Account validated`
        if(raw.validated)
            msg.content = `Your account registration has been validated by the administrator`
        else
            msg.content = `Your account registration has been refused by the administrator`
        msg.senderId = null // from the system
        msg.receiverId = m.id
        msg.tags = "VALIDATION"
        console.log()
        console.warn("In order ot advance quickly, the old DAO version is used, should be updated later")
        await MessageDAO.getInstance().add(msg)

        return {
            "object": msg
        }
    }
}
module.exports = ValidationBL
