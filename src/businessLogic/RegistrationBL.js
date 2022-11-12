const BaseBL = require("./BaseBL");
const isValidUrl = require("../utils/isValidUrl");
const isValidPostcode = require("../utils/isValidPostcode");
const isValidEmail = require("../utils/isValidEmail");
const isValidPhone = require("../utils/isValidPhone");
const _ = require('lodash')
const Breeder = require("../model/Breeder");
const Address = require("../model/Address");
const BreederDAO = require("../dao/BreederDAO");
const Owner = require("../model/Owner");
const OwnerDAO = require("../dao/OwnerDAO");
const VetDAO = require("../dao/VetDAO");
const Vet = require("../model/Vet");
const AdminDAO = require("../dao/AdminDAO");
const Message = require("../model/Message");
const MessageDAO = require("../dao/MessageDAO");
const TimeBL = require("./TimeBL");
const Scientist = require("../model/Scientist");
const ScientistDAO = require("../dao/ScientistDAO");
const PaymentReceipt = require("../model/PaymentReceipt");
const PaymentReceiptDAO = require("../dao/PaymentReceiptDAO");
const ValidationNote = require("../model/ValidationNote");
const ValidationNoteDAO = require("../dao/ValidationNoteDAO");
const assertNotEmpty = require("../utils/validator/assertNotEmpty");
const assertValidPhone = require("../utils/validator/assertValidPhone");
const assertValidEmail = require("../utils/validator/assertValidEmail");
const lodash = require("lodash");
const BaseMemberDAO = require("../dao/crud/BaseMemberDAO");
const assertNotEmptyFile = require("../utils/validator/assertNotEmptyFile");
const TestOrderDAO = require("../dao/crud/TestOrderDAO");
const TestSampleDAO = require("../dao/crud/TestSampleDAO");
const CRUDBL = require("./CRUDBL");
const AddressDAO = require("../dao/crud/AddressDAO");

class RegistrationBL extends BaseBL {
    static instance = null;
    static getInstance(){
        if(this.instance == null) {
            this.instance = new RegistrationBL()
        }
        return this.instance
    }
    static tearDown(){
        this.instance = null;
    }

    constructor(){
        super();
    }

    getModel(type){
        if(type == "breeder")
            return new Breeder()
        if(type == "owner")
            return new Owner()
        if(type == "vet")
            return new Vet()
        throw("Unknown type")
    }

    getDAO(type){
        if(type == "breeder")
            return BreederDAO
        if(type == "owner")
            return OwnerDAO
        if(type == "vet")
            return VetDAO
        throw("Unknown type")
    }

    async register(
        {
            type,
            name1, name2, phone, email,
            address, country, changwat, amphoe, tambon, postcode,
            username, password, passwordCheck, website, subscribe
        }
        ){

        // Data -> model
        let model, dao
        if(type == "breeder") {
            model = new Breeder()
            dao = BreederDAO.getInstance()
        }
        if(type == "owner") {
            model = new Owner()
            dao = OwnerDAO.getInstance()
        }
        if(type == "vet") {
            model = new Vet()
            dao = VetDAO.getInstance()
        }
        if(type == "scientist"){
            model = new Scientist
            dao = ScientistDAO.getInstance()
        }

        /**
         * Handle exception
         */
        let errors = {}
        if(name1 == "")
            errors["name1"] = "EMPTY_NAME1"
        if(name2 == "")
            errors["name2"] = "EMPTY_NAME2"
        if(!isValidPhone(phone))
            errors["phone"] = "INVALID_PHONE"
        if(!isValidEmail(email))
            errors["email"] = "INVALID_EMAIL"
        if(address == "")
            errors["address"] = "EMPTY_ADDRESS"
        if(changwat == "")
            errors["changwat"] = "EMPTY_CHANGWAT"
        if(!isValidPostcode(postcode))
            errors["postcode"] = "INVALID_POSTCODE"
        if(username == "")
            errors["username"] = "EMPTY_USERNAME"
        if(await dao.doesUsernameExists(username))
            errors["username"] = "UNAVAILABLE_USERNAME"
        if(password.length < 8)
            errors["password"] = "INVALID_PASSWORD"
        if(passwordCheck != password)
            errors["passwordCheck"] = "MISMATCHED_PASSWORD"
        if(website != "" && !isValidUrl(website))
            errors["website"] = "INVALID_WEBSITE"
        if(!_.isEmpty(errors))
            return {"errors": errors}


        model.name1 = name1
        model.name2 = name2
        model.phone = phone
        model.email = email
        model.username = username
        model.password = password
        model.website = website
        model.subscribe = subscribe

        let addr = new Address()
        addr.address1 = address
        addr.country = country
        addr.changwat = changwat
        addr.amphoe = amphoe
        addr.tambon = tambon
        addr.postcode = postcode
        model.address = addr

        // Calling the DataAccess method
        await dao.add(model)


        // ADMIN NOTIFICATION
        // If everything is ok
        // It should notify the admin that a new user has been registered
        let admin = await AdminDAO.getInstance().getByUsername("admin")
        let msg = new Message()
        msg.title = `A new <b>${type}</b> has been registered`
        msg.content = `${name1} ${name2} &lt;${email}&gt; has registered a new account.`
        msg.senderId = null
        msg.receiverId = admin.id
        msg.tags = "REGISTRATION, NEW_MEMBER"
        if(TimeBL.getInstance().time != null)
            msg.date = TimeBL.getInstance().time
        else
            msg.date = new Date()
        await MessageDAO.getInstance().add(msg)

        let welcome = new Message()
        welcome.title = `Welcome to the Anivet backoffice new Application`
        welcome.content = `Phasellus sit amet sapien ac urna ullamcorper finibus vel a ligula. Donec sed urna at <a href="/">odio bibendum blandit</a>. Nulla non tempus ipsum.`
        welcome.senderId = null
        welcome.receiverId = model.id
        welcome.tags = "MESSAGE"
        if(TimeBL.getInstance().time != null)
            welcome.date = TimeBL.getInstance().time
        else
            welcome.date = new Date()
        await MessageDAO.getInstance().add(welcome)

        return {
            "object": model
        }
    }

    async changePassword(
        {
            memberId,
            password,
            newPassword,
            newPasswordCheck
        }
    ){
        let errors = {}
        if(password == "")
            errors["password"] = "EMPTY_PASSWORD"
        if(newPassword == "")
            errors["newPassword"] = "EMPTY_PASSWORD"
        if(newPasswordCheck != newPassword)
            errors["newPasswordCheck"] = "PASSWORD_MISMATCHED"
        if(!_.isEmpty(errors))
            return {"errors": errors}

        let bmd = BaseMemberDAO.getInstance()
        let member = await bmd.getById(memberId)
        let a = await bmd.authenticate(member.type, member.username, password)
        if(a == null) {
            errors["form"] = "INVALID_CREDENTIALS"
            return {"errors":errors}
        }

        a.password = newPassword
        await BaseMemberDAO.getInstance().update(a)
        return {
            "object": a
        }
    }

    async updateUserBackoffice(
        {
            id,
            name1, name2, phone, email,
            address1, country, changwat, amphoe, tambon, postcode,
            username, password, website, subscribe
        }
    ){
        // The first step
        let errors = {}

        let model = await BaseMemberDAO.getInstance().getById(id)
        if(model == null)
            errors["forms"] = "UNHANDLED_ERROR"


        if(name1 == "")
            errors["name1"] = "EMPTY_NAME1"
        if(name2 == "")
            errors["name2"] = "EMPTY_NAME2"
        if(!isValidPhone(phone))
            errors["phone"] = "INVALID_PHONE"
        if(!isValidEmail(email))
            errors["email"] = "INVALID_EMAIL"

        if(country == "")
            errors["country"] = "EMPTY_COUNTRY"
        if(address1 == "")
            errors["address1"] = "EMPTY_ADDRESS"
        if(changwat == "")
            errors["changwat"] = "EMPTY_CHANGWAT"
        if(!isValidPostcode(postcode))
            errors["postcode"] = "INVALID_POSTCODE"
        if(website != "" && !isValidUrl(website))
            errors["website"] = "INVALID_WEBSITE"

        if(username == "")
            errors["username"] = "EMPTY_USERNAME"
        if(password.length > 0 && password.length < 8)
            errors["password"] = "INVALID_PASSWORD"

        if(!_.isEmpty(errors))
            return {"errors": errors}

        // Only some variables has been changed
        // Change the address also, update the form
        model.name1 = name1
        model.name2 = name2
        model.phone = phone
        model.email = email
        model.username = username
        model.password = password || model.pasword
        model.website = website || model.website

        model.address.address1 = address1
        model.address.country = country
        model.address.changwat = changwat
        model.address.amphoe = amphoe
        model.address.tambon = tambon
        model.address.postcode = postcode

        await BaseMemberDAO.getInstance().update(model)
        return {
            "object": model
        }
    }

    async userDetails(id){
        let m = await BaseMemberDAO.getInstance().getOne("", id)
        return {
            "object": m
        }
    }

    async submitReceipt(
        {
            reference,
            method,
            linkReference,
            file,
            testOrderId
        }
    ){

        /**
         * Handle exception
         */
        let errors = {}
        if(reference == "")
            errors["reference"] = "EMPTY_REFERENCE"
        // Not used anymore, replaced by the Authentication token
        // and session variables
        //if(linkReference == "")
        //    errors["linkReference"] = "EMPTY_LINK_REFERENCE"
        if(file.length == 0)
            errors["file"] = "EMPTY_FILE"
        if(file.length > 1000000)
            errors["file"] = "FILE_TOO_HEAVY"
        if(!_.isEmpty(errors))
            return {"errors": errors}


        let model = new PaymentReceipt()
        model.reference = reference
        model.method = method
        model.linkReference = linkReference
        model.file = file
        model.testOrderId = testOrderId
        await PaymentReceiptDAO.getInstance().add(model)

        return {
            "object": model
        }
    }

    async submitValidationInfo(
        {validated, message, userId}
    ){
        // In case validated is false
        // The admin has UNvalidated the user registration
        // The message field can be empty if the user hasn't been validated
        // If the user hasn't been validated (validate=false)
        // The message field is required


        // Validation
        let errors = {}
        if(!validated)
            if(message.trim().length == 0)
                errors["message"] = "EMPTY_MESSAGE_WHEN_NOT_VALIDATED"
        if(!_.isEmpty(errors))
            return {"errors": errors}

        // Insert Note
        let note = new ValidationNote()
        note.message = message
        note.validated = validated
        note.date = TimeBL.getInstance().time
        await ValidationNoteDAO.getInstance().add(note)

        // Update User
        let user = await BaseMemberDAO.getInstance().getById(userId)
        user.validationNoteId = note.id
        await BaseMemberDAO.getInstance().update(user)

        // Notify User : send a message to a user that he has been validated by the admin
        let msg = new Message()
        msg.title = `Account validated`
        msg.content = `Your account registration has been validated by the administrator`
        msg.senderId = null // from the system
        msg.receiverId = userId
        msg.tags = "VALIDATION"
        if(TimeBL.getInstance().time != null)
            msg.date = TimeBL.getInstance().time
        else
            msg.date = new Date()
        await MessageDAO.getInstance().add(msg)

        return {
            "object": msg
        }
    }

    async validateReceipt(
        {validated, message, receiptId}
    ){
        // Validation
        let errors = {}
        if(!validated)
            if(message.trim().length == 0)
                errors["message"] = "EMPTY_MESSAGE_WHEN_NOT_VALIDATED"
        if(!_.isEmpty(errors))
            return {"errors": errors}


        // Insert Note
        let note = new ValidationNote()
        note.message = message
        note.validated = validated
        note.date = TimeBL.getInstance().time
        await ValidationNoteDAO.getInstance().add(note)

        // Update payment receipt
        let receipt = await PaymentReceiptDAO.getInstance().getById(receiptId)
        receipt.validationNoteId = note.id
        await PaymentReceiptDAO.getInstance().update(receipt)

        // Notify User : send a message to a user that the order has been validated by the admin
        /*let msg = new Message()
        msg.title = `Account validated`
        msg.content = `Your order registration has been validated by the administrator`
        msg.senderId = null // from the system
        //msg.receiverId = order.
        msg.tags = "VALIDATION"
        if(TimeBL.getInstance().time != null)
            msg.date = TimeBL.getInstance().time
        else
            msg.date = new Date()
        await MessageDAO.getInstance().add(msg)*/

        return {
            "object": receipt
        }
    }


    /**
     *
     *  NEW GENEERATION FUNCTIONS ARE HERE
     *  ALL DEFINED ABOVE ARE NOT USED ANYMORE
     *  THEY SHOULD BE REMOVED FROM HERE
     *
     */
    async post_account(raw){
        let e = {}
        assertNotEmpty(raw, "name1", e)
        assertNotEmpty(raw, "name2", e)
        assertValidPhone(raw, "phone", e)
        assertValidEmail(raw, "email", e)
        assertNotEmpty(raw.address, "address1", e)
        assertNotEmpty(raw.address, "country", e)
        assertNotEmpty(raw.address, "postcode", e)
        if(!lodash.isEmpty(e)) return {errors: e}

        let m = BaseMemberDAO.getInstance().raw_to_model(raw)
        await BaseMemberDAO.getInstance().add(m)

        raw.address.baseMemberId = m.id
        let a = AddressDAO.getInstance().raw_to_model(raw.address)
        await AddressDAO.getInstance().add(a)

        return {object: m}
    }

    async post_testSample(raw){
        let e = {}
        //assertNotEmpty(raw, "type", e)
        assertNotEmpty(raw, "animal", e)
        assertNotEmpty(raw, "petSpecie", e)
        assertNotEmptyFile(raw, "image", e)
        if(!lodash.isEmpty(e)) return {errors: e}

        // First, check if that person has testOrder
        let query = {q: {memberId: raw.triggererId}}
        let testOrders = await TestOrderDAO.getInstance().searchAll("", undefined, undefined, query)
        if(testOrders.length > 1)
            console.error("Error, user can have at maximum one registered testOrder")

        let testOrder
        if(testOrders.length == 0){
            // First time
            raw.testOrder = {
                memberId: raw.triggererId,
                date: raw.date
            }
            testOrder = TestOrderDAO.getInstance().raw_to_model(raw.testOrder)
            await TestOrderDAO.getInstance().add(testOrder)
        }else
            testOrder = testOrders[0]
        raw.testOrderId = testOrder.id // Not null


        // Add testSample (using Internal BL Layer)
        let o = await CRUDBL.getInstance().testSample.insert(raw)
        if(o.hasOwnProperty('errors')) return o

        return {entity: o.object}
    }

    async get_testSample(raw){
        console.log()
        // triggererData
        let baseMember = await BaseMemberDAO.getInstance().getOne("", raw.triggererId)

        let query = {q: {memberId: raw.triggererId}}
        let testOrders = await TestOrderDAO.getInstance().searchAll("", undefined, undefined, query)
        if(testOrders.length != 1)
            console.error("INTERNAL ERROR : User should have registered exactly one order")

        let testOrder = testOrders[0]
        let query2 = {q: {testOrderId: testOrder.id}}
        let testSamples = await TestSampleDAO.getInstance().searchAll("", undefined, undefined, query2)

        return testSamples
    }

    async getOne_testSample(raw){
        let testSample = await CRUDBL.getInstance().loadOne(TestSampleDAO.getInstance(), "edit", raw.id)
        return testSample
    }

    async put_testSample(raw){
        let o = await CRUDBL.getInstance().testSample.update(raw)
        return {entity: o.object}
    }

    async post_paymentReceipt(raw){
        let o = await CRUDBL.getInstance().paymentReceipt.insert(raw)
        if(o.hasOwnProperty('errors')) return o
        return {entity: o.object}
    }
}
module.exports = RegistrationBL
