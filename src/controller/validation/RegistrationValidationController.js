const BaseValidationController = require("./BaseValidationController");
const BaseMemberDAO = require("../../dao/crud/BaseMemberDAO");
const express = require("express");
const {isAdminToken} = require("../../utils/token");

class RegistrationValidationController extends BaseValidationController {
    static instance = null;
    static getInstance(){
        if(this.instance == null) {
            this.instance = new RegistrationValidationController()
        }
        return this.instance
    }
    static tearDown(){
        this.instance = null;
    }

    constructor(){
        super()
        this.dao = BaseMemberDAO.getInstance()
        // ไม่มีเขื่อ
    }
}
module.exports = RegistrationValidationController
