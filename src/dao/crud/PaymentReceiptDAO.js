const BaseCrudDAO = require("./BaseCrudDAO");
const sqlExecute = require("../../utils/sqlExecute");
const PaymentReceipt = require("../../model/PaymentReceipt");
const ValidationNoteDAO = require("./ValidationNoteDAO");
const sqlQueryMultiple = require("../../utils/sqlQueryMultiple");
const sqlQueryOne = require("../../utils/sqlQueryOne");
const BaseMemberDAO = require("./BaseMemberDAO");

class PaymentReceiptDAO extends BaseCrudDAO{
    static instance = null;
    static getInstance(){
        if(this.instance == null) {
            this.instance = new PaymentReceiptDAO()
        }
        return this.instance
    }
    static tearDown(){
        this.instance = null;
    }

    name="paymentReceipt"

    async buildTable(){
        await sqlExecute("" +
            "CREATE TABLE `paymentReceipt` (" +
            "   paymentReceipt_id INT(6) UNSIGNED AUTO_INCREMENT PRIMARY KEY," +
            "   paymentReceipt_reference VARCHAR(255)," +
            "   paymentReceipt_method VARCHAR(255)," +
            "   paymentReceipt_linkReference VARCHAR(255)," +
            "   paymentReceipt_file LONGBLOB," +
            "   paymentReceipt_validationNoteId INT(6) UNSIGNED," +
            "   paymentReceipt_testOrderId INT(6) UNSIGNED," +
            "" +
            "   CONSTRAINT `fk_paymentReceipt_validationNoteId` FOREIGN KEY (paymentReceipt_validationNoteId) REFERENCES validationNote (validationNote_id) ON DELETE CASCADE," +
            "   CONSTRAINT `fk_paymentReceipt_testOrderId` FOREIGN KEY (paymentReceipt_testOrderId) REFERENCES testOrder (testOrder_id) ON DELETE CASCADE" +
            ")" +
            "ENGINE = InnoDB CHARSET=utf8 COLLATE utf8_general_ci;;")

        // Views
        await sqlExecute("" +
            "CREATE VIEW `paymentReceipt_` AS" +
            "   SELECT      paymentReceipt_id," +
            "               paymentReceipt_reference," +
            "               paymentReceipt_method," +
            "               paymentReceipt_linkReference," +
            "               paymentReceipt_testOrderId," +
            "               paymentReceipt_validationNoteId," +
            "               baseMember_email" +
            " from paymentReceipt" +
            "   LEFT JOIN `testOrder` ON testOrder_id=paymentReceipt_testOrderId\n" +
            "   LEFT JOIN `baseMember` ON baseMember_id=testOrder_memberId")
        await sqlExecute("" +
            "CREATE VIEW `paymentReceipt_details` AS" +
            "   SELECT      paymentReceipt_id," +
            "               paymentReceipt_reference," +
            "               paymentReceipt_method," +
            "               paymentReceipt_file," +
            "               paymentReceipt_testOrderId," +
            "               baseMember_email" +
            " from paymentReceipt" +
            "   LEFT JOIN `testOrder` ON testOrder_id=paymentReceipt_testOrderId\n" +
            "   LEFT JOIN `baseMember` ON baseMember_id=testOrder_memberId")
        await sqlExecute("" +
            "CREATE VIEW `paymentReceipt_validation` AS " +
            "SELECT * from `paymentReceipt_`" +
            "   LEFT JOIN `validationNote` ON validationNote_id=paymentReceipt_validationNoteId")
        await sqlExecute("" +
            "CREATE VIEW `paymentReceipt_validation_details` AS" +
            "   SELECT * from `paymentReceipt_validation`")
    }

    async destroyTable(){
        // Views
        await sqlExecute("DROP VIEW IF EXISTS  `paymentReceipt_validation_details`")
        await sqlExecute("DROP VIEW IF EXISTS  `paymentReceipt_validation`")
        await sqlExecute("DROP VIEW IF EXISTS  `paymentReceipt_details`")
        await sqlExecute("DROP VIEW IF EXISTS  `paymentReceipt_`")

        await sqlExecute("DROP TABLE IF EXISTS  `paymentReceipt`")
    }

    sql_search_string={
        "": "LOWER(CONCAT(paymentReceipt_reference, ' ', paymentReceipt_id))"
    }

    sql_to_model={
        "": (r)=>{
            let o = new PaymentReceipt()
            o.id = r.paymentReceipt_id
            o.reference = r.paymentReceipt_reference
            o.method = r.paymentReceipt_method
            o.linkReference = r.paymentReceipt_linkReference
            o.validationNoteId = r.paymentReceipt_validationNoteId
            o.testOrderId = r.paymentReceipt_testOrderId
            return o
        },
        "details": (r)=>{
            let o = this.sql_to_model[""](r)
            o.file = r.paymentReceipt_file
            return o
        },
        "validation": (r)=>{
            let o = this.sql_to_model[""](r)
            o.validationNote = ValidationNoteDAO.getInstance().sql_to_model[""](r)
            o.baseMember = BaseMemberDAO.getInstance().sql_to_model[""](r)
            return o
        },
        "validation_details": (r)=>{
            return this.sql_to_model["validation"](r)
        }
    }

    model_to_raw={
        "": (m)=>{
            return {
                id: m.id,
                reference: m.reference,
                method: m.method,
                linkReference: m.linkReference,
                testOrderId: m.testOrderId,
                validationNoteId: m.validationNoteId,
                baseMemberEmail: m.baseMemberEmail,
            }
        },
        "details": (m)=>{
            let o = {
                ...this.model_to_raw[""](m),
                file: m.file
            }
            return o
        },
        "validation": (m)=>{
            let o = {
                ...this.model_to_raw[""](m),
                validationNote: ValidationNoteDAO.getInstance().model_to_raw[""](m.validationNote),
                baseMember: BaseMemberDAO.getInstance().model_to_raw[""](m.baseMember)
            }
            return o
        },
        "validation_details": (m)=>{
            return this.model_to_raw["validation"](m)
        }
    }

    raw_to_model(raw){// For insertion and update, not for listing
        let o = new PaymentReceipt()
        o.id = raw.id // Only for update
        o.reference = raw.reference
        o.method = raw.method
        o.linkReference = raw.linkReference
        o.file = raw.file
        o.validationNoteId = raw.validationNoteId
        o.testOrderId = raw.testOrderId
        return o
        // Related table is not managed in the raw_to_model method
        // It is done in the Business Logic Layer (BLL)
    }

    async getAll(view, offset, limit){ // TO BE INHERITED
        if(view == undefined)
            view = "" // The default view
        let viewName = this.name + "_" + view // Il est préférable de le superclasser
        let suffix = (offset!=undefined&&limit!=undefined)?` LIMIT ${limit} OFFSET ${offset}`:``
        return await sqlQueryMultiple(`SELECT * FROM ${viewName} ${suffix}`, this.sql_to_model[view])
    }

    async getOne(view, id){
        if(view == undefined)
            view = "" // The default view
        let viewName = this.name + "_" + view
        return await sqlQueryOne(`SELECT * FROM ${viewName} WHERE paymentReceipt_id=?`, [id], this.sql_to_model[view])
    }

    async add(m){
        let d = await sqlExecute("" +
            "INSERT INTO `paymentReceipt` (" +
            "paymentReceipt_reference, paymentReceipt_method, paymentReceipt_linkReference," +
            "paymentReceipt_file, paymentReceipt_testOrderId)" +
            " VALUES (?, ?, ?, ?, ?)", [
            m.reference, m.method, m.linkReference, m.file, m.testOrderId
        ])
        m.id = d.insertId
        return m
    }

    async update(m){
        await sqlExecute("" +
            "UPDATE `paymentReceipt` SET" +
            "   paymentReceipt_reference=?," +
            "   paymentReceipt_method=?," +
            "   paymentReceipt_linkReference=?," +
            "   paymentReceipt_validationNoteId=?," +
            "   paymentReceipt_testOrderId=?" +
            " WHERE paymentReceipt_id=?",
            [m.reference, m.method, m.linkReference, m.validationNoteId, m.testOrderId, m.id]
        )
    }
}
module.exports = PaymentReceiptDAO
