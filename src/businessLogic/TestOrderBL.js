const BaseBL = require("./BaseBL");
const _ = require('lodash')
const TestOrderWithSamples = require("../model/TestOrderWithSamples");
const TestSample = require("../model/TestSample");
const TestOrderDAO = require("../dao/TestOrderDAO");
const isValidEmail = require("../utils/isValidEmail");
const AdminDAO = require("../dao/AdminDAO");
const MessageDAO = require("../dao/MessageDAO");
const Message = require("../model/Message");
const TimeBL = require("./TimeBL");

class TestOrderBL extends BaseBL{
    static instance = null;
    static getInstance(){
        if(this.instance == null) {
            this.instance = new TestOrderBL()
        }
        return this.instance
    }
    static tearDown(){
        this.instance = null;
    }

    async registerTest(
        {name1, name2, email, memberId, tests}
    ){

        // Remove unused sample data container
        let filteredSamples = []
        for(let i = 0; i < tests.length; i++){
            let s = tests[i]
            let d = s.sampleId + s.animal + s.type + s.petId + s.petSpecie + s.image
            if(d.trim().length > 0)
                filteredSamples.push(s)
        }

        // First step
        let errors = {}

        if(name1 == "")
            errors["name1"] = "EMPTY_NAME1"
        if(name2 == "")
            errors["name2"] = "EMPTY_NAME2"
        if(!isValidEmail(email))
            errors["email"] = "INVALID_EMAIL"
        if(filteredSamples.length == 0)
            errors["form"] = "NO_SAMPLE_SUBMITED"

        let sampleErrors = []
        filteredSamples.forEach((s)=>{
            let sErrors = {}
            if(s.sampleId == "")
                sErrors["sampleId"] = "EMPTY_SAMPLEID"
            if(s.animal == "")
                sErrors["animal"] = "EMPTY_ANIMAL"
            if(s.type == "")
                sErrors["type"] = "EMPTY_TYPE"
            if(s.petId == "")
                sErrors["petId"] = "EMPTY_PETID"
            // PetSpecie is optional
            // Image is also optional
            if(!_.isEmpty(sErrors))
                sampleErrors.push(sErrors)
        })
        if(sampleErrors.length > 0)
            errors["tests"] = sampleErrors
        if(!_.isEmpty(errors))
            return {"errors": errors}

        let order = new TestOrderWithSamples()
        order.name1 = name1
        order.name2 = name2
        order.email = email
        order.memberId = memberId
        order.samples = []
        for(const _s of filteredSamples){
            let sample = new TestSample()
            sample.animal = _s.animal
            sample.type = _s.type
            sample.petId = _s.petId
            sample.petSpecie = _s.petSpecie
            sample.image = _s.image
            sample.testOrderId = null
            order.samples.push(sample)
        }
        await TestOrderDAO.getInstance().add(order)

        // IF everything is OK
        // We send a notification to the admin
        let admin = await AdminDAO.getInstance().getByUsername("admin")
        let msg = new Message()
        msg.title = `A new order has purchased`
        msg.content = `${name1} ${name2} &lt;${email}&gt; has purchased`
        msg.senderId = null
        msg.receiverId = admin.id
        msg.tags = "NEW_ORDER"

        if(TimeBL.getInstance().time != null)
            msg.date = TimeBL.getInstance().time
        else
            msg.date = new Date()

        await MessageDAO.getInstance().add(msg)

        return {
            "object": order
        }
    }

}
module.exports = TestOrderBL
