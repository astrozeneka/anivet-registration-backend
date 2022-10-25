const BaseDataController = require("./BaseDataController");
const PaymentReceiptDAO = require("../../dao/crud/PaymentReceiptDAO");

class PaymentReceiptController extends BaseDataController{
    static instance = null;
    static getInstance(){
        if(this.instance == null) {
            this.instance = new PaymentReceiptController()
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
module.exports = PaymentReceiptController
