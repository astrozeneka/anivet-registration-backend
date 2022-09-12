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
const BaseMemberDAO = require("../dao/BaseMemberDAO");
const AdminDAO = require("../dao/AdminDAO");
const Message = require("../model/Message");
const MessageDAO = require("../dao/MessageDAO");

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

        // If everything is ok
        // It should notify the admin that a new user has been registered
        let admin = await AdminDAO.getInstance().getByUsername("admin")
        let msg = new Message()
        msg.title = "NEW MEMBER"
        msg.content = "A new member has been registered"
        msg.senderId = null
        msg.receiverId = admin.id
        msg.date = new Date()
        await MessageDAO.getInstance().add(msg)

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
}
module.exports = RegistrationBL
