const BaseValidationController = require("./BaseValidationController");
const PaymentReceiptDAO = require("../../dao/crud/PaymentReceiptDAO");

class PaymentReceiptValidationController extends BaseValidationController {
    static instance = null;
    static getInstance(){
        if(this.instance == null) {
            this.instance = new PaymentReceiptValidationController()
        }
        return this.instance
    }
    static tearDown(){
        this.instance = null;
    }

    constructor(){
        super()
        this.dao = PaymentReceiptDAO.getInstance()
    }
}
module.exports = PaymentReceiptValidationController
