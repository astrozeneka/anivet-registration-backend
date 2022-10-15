const assertNotEmpty = require("../utils/validator/assertNotEmpty");
const lodash = require("lodash");
const BaseMemberDAO = require("../dao/crud/BaseMemberDAO");
const ValidationNote = require("../model/ValidationNote");
const TimeBL = require("./TimeBL");
const ValidationNoteDAO = require("../dao/crud/ValidationNoteDAO");
const Message = require("../model/Message");
const MessageDAO = require("../dao/crud/MessageDAO");
const PaymentReceiptDAO = require("../dao/crud/PaymentReceiptDAO");
const TestSampleDAO = require("../dao/crud/TestSampleDAO");
const TestOrderDAO = require("../dao/crud/TestOrderDAO");

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

    validate = {
        "registration":async (raw)=>{
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
            console.warn("In order ot advance quickly, the old DAO version is used, should be updated later")
            await MessageDAO.getInstance().add(msg)

            return {
                "object": msg
            }
        },
        "paymentReceipt": async(raw)=>{
            // Validate
            let e = {}
            if(!raw.validationNote.message)
                assertNotEmpty(raw.validationNote, "message", e)
            if(!lodash.isEmpty(e))
                return {errors: e}

            // If note doesn't exists, create a new
            let m = await PaymentReceiptDAO.getInstance().getOne("validation_details", raw.id)
            let note = ValidationNoteDAO.getInstance().raw_to_model(raw.validationNote)
            if(m.validationNoteId == null){
                note = ValidationNoteDAO.getInstance().raw_to_model(raw.validationNote)
                note.date = TimeBL.getInstance().time
                await ValidationNoteDAO.getInstance().add(note)
                m.validationNoteId = note.id
                await PaymentReceiptDAO.getInstance().update(m)
            }else{
                note.id = m.validationNoteId
                await ValidationNoteDAO.getInstance().update(note)
            }

            m = await PaymentReceiptDAO.getInstance().getOne("validation_details", raw.id)
            let msg = new Message()
            msg.title = `Account validated`
            if(raw.validated)
                msg.content = `Your account registration has been validated by the administrator`
            else
                msg.content = `Your account registration has been refused by the administrator`
            msg.senderId = null // from the system
            msg.receiverId = m.id
            msg.tags = "VALIDATION"
            await MessageDAO.getInstance().add(msg)

            return {
                "object": msg
            }
        },
        "testSample": async(raw)=>{
            console.log()
            let e = {}
            if(!raw.validationNote.message)
                assertNotEmpty(raw.validationNote, "message", e)
            if(!lodash.isEmpty(e))
                return {errors: e}

            let m = await TestSampleDAO.getInstance().getOne("validation_details", raw.id)
            let note = ValidationNoteDAO.getInstance().raw_to_model(raw.validationNote)
            if(m.validationNoteId == null){// Note doesn't exists
                note = ValidationNoteDAO.getInstance().raw_to_model(raw.validationNote)
                note.date = TimeBL.getInstance().time
                await ValidationNoteDAO.getInstance().add(note)
                m.validationNoteId = note.id
                await TestSampleDAO.getInstance().update(m)
            }else{
                note.id = m.validationNoteId
                await ValidationNoteDAO.getInstance().update(note)
            }

            m = await TestSampleDAO.getInstance().getOne("validation_details", raw.id)
            let msg = new Message()
            msg.title = `Account validated`
            if(raw.validated)
                msg.content = `Your account registration has been validated by the administrator`
            else
                msg.content = `Your account registration has been refused by the administrator`
            msg.senderId = null // from the system
            msg.receiverId = m.id
            msg.tags = "VALIDATION"
            await MessageDAO.getInstance().add(msg)

            return {
                "object": msg
            }
        },
        "testOrder": async(raw)=>{
            let e = {}
            if(!raw.validationNote.message)
                assertNotEmpty(raw.validationNote, "message", e)
            if(!lodash.isEmpty(e))
                return {errors: e}

            let m = await TestOrderDAO.getInstance().getOne("validation_details", raw.id)
            let note = ValidationNoteDAO.getInstance().raw_to_model(raw.validationNote)
            if(m.validationNoteId == null){
                note = ValidationNoteDAO.getInstance().raw_to_model(raw.validationNote)
                note.date = TimeBL.getInstance().time
                await ValidationNoteDAO.getInstance().add(note)
                m.validationNoteId = note.id
                await TestOrderDAO.getInstance().update(m)
            }else{
                note.id = m.validationNoteId
                await ValidationNoteDAO.getInstance().update(note)
            }

            m = await TestOrderDAO.getInstance().getOne("validation_details", raw.id)
            let msg = new Message()
            msg.title = `Account validated`
            if(raw.validated)
                msg.content = `Your account registration has been validated by the administrator`
            else
                msg.content = `Your account registration has been refused by the administrator`
            msg.senderId = null // from the system
            msg.receiverId = m.id
            msg.tags = "VALIDATION"
            await MessageDAO.getInstance().add(msg)

            return {
                "object": msg
            }
        }
    }

    testSample = {
        async byTestOrder(view, offset, limit, testOrderId){
            return await TestSampleDAO.getInstance().getAllByTestOrderId(view, offset, limit, testOrderId)
        }
    }
}
module.exports = ValidationBL
