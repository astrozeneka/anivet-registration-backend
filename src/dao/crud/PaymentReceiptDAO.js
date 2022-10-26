const BaseCrudDAO = require("./BaseCrudDAO");
const sqlExecute = require("../../utils/sqlExecute");
const PaymentReceipt = require("../../model/PaymentReceipt");
const ValidationNoteDAO = require("./ValidationNoteDAO");
const sqlQueryMultiple = require("../../utils/sqlQueryMultiple");
const sqlQueryOne = require("../../utils/sqlQueryOne");
const BaseMemberDAO = require("./BaseMemberDAO");
const FileDAO = require("./FileDAO");
const TestOrderDAO = require("./TestOrderDAO");

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
            "   paymentReceipt_validationNoteId INT(6) UNSIGNED," +
            "   paymentReceipt_testOrderId INT(6) UNSIGNED," +
            "   paymentReceipt_fileId INT(6) UNSIGNED NULL," +
            "   paymentReceipt_date DATETIME," +
            "" +
            "   CONSTRAINT `fk_paymentReceipt_validationNoteId` FOREIGN KEY (paymentReceipt_validationNoteId) REFERENCES validationNote (validationNote_id) ON DELETE CASCADE," +
            "   CONSTRAINT `fk_paymentReceipt_testOrderId` FOREIGN KEY (paymentReceipt_testOrderId) REFERENCES testOrder (testOrder_id) ON DELETE CASCADE," +
            "   CONSTRAINT `fk_paymentReceipt_fileId` FOREIGN KEY (paymentReceipt_fileId) REFERENCES file (file_id) ON DELETE SET NULL" +
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
            "               paymentReceipt_fileId," +
            "               baseMember_email, baseMember_username," +
            "               paymentReceipt_date," +
            "" +
            "               file_id, file_type, file_name" +
            " from paymentReceipt" +
            "   LEFT JOIN `testOrder` ON testOrder_id=paymentReceipt_testOrderId\n" +
            "   LEFT JOIN `baseMember` ON baseMember_id=testOrder_memberId" +
            "   LEFT JOIN `file` ON file_id=paymentReceipt_fileId")
        await sqlExecute("" +
            "CREATE VIEW `paymentReceipt_details` AS" +
            "   SELECT      paymentReceipt_id," +
            "               paymentReceipt_reference," +
            "               paymentReceipt_method," +
            "               paymentReceipt_testOrderId," +
            "               baseMember_email," +
            "               paymentReceipt_fileId," +
            "               paymentReceipt_date," +
            "" +
            "               file_id, file_type, file_name" +
            " from paymentReceipt" +
            "   LEFT JOIN `testOrder` ON testOrder_id=paymentReceipt_testOrderId\n" +
            "   LEFT JOIN `baseMember` ON baseMember_id=testOrder_memberId" +
            "   LEFT JOIN `file` ON file_id=paymentReceipt_fileId")
        await sqlExecute("" +
            "CREATE VIEW `paymentReceipt_validation` AS " +
            "SELECT * from `paymentReceipt_`" +
            "   LEFT JOIN `validationNote` ON validationNote_id=paymentReceipt_validationNoteId")
        await sqlExecute("" +
            "CREATE VIEW `paymentReceipt_validation_details` AS" +
            "   SELECT * from `paymentReceipt_validation`")
        await sqlExecute("" +
            "CREATE VIEW `paymentReceipt_file` AS" +
            "   SELECT * " +
            "   FROM paymentReceipt" +
            "   LEFT JOIN `testOrder` ON testOrder_id=paymentReceipt_testOrderId\n" +
            "   LEFT JOIN `baseMember` ON baseMember_id=testOrder_memberId" +
            "   LEFT JOIN `file` ON file_id=paymentReceipt_fileId"
        )
        await sqlExecute("" +
            "CREATE VIEW `paymentReceipt_edit` AS" +
            "   SELECT * FROM paymentReceipt_details")
    }

    async destroyTable(){
        // Views
        await sqlExecute("DROP VIEW IF EXISTS `paymentReceipt_edit`")
        await sqlExecute("DROP VIEW IF EXISTS `paymentReceipt_file`")
        await sqlExecute("DROP VIEW IF EXISTS  `paymentReceipt_validation_details`")
        await sqlExecute("DROP VIEW IF EXISTS  `paymentReceipt_validation`")
        await sqlExecute("DROP VIEW IF EXISTS  `paymentReceipt_details`")
        await sqlExecute("DROP VIEW IF EXISTS  `paymentReceipt_`")

        await sqlExecute("DROP TABLE IF EXISTS  `paymentReceipt`")
    }

    sql_search_string={
        "": "LOWER(CONCAT(paymentReceipt_reference, ' ', paymentReceipt_id, ' ', paymentReceipt_method))"
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
            o.fileId = r.paymentReceipt_fileId
            o.file = FileDAO.getInstance().sql_to_model[""](r)
            o.triggerer = BaseMemberDAO.getInstance().sql_to_model[""](r)
            o.date = r.paymentReceipt_date
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
        },
        "file": (r)=>{
            let o = this.sql_to_model[""](r)
            o.file = FileDAO.getInstance().sql_to_model["content"](r)
            return o
        },
        "edit": (r)=>{
            let o = this.sql_to_model[""](r)
            return o
        }
    }

    model_to_raw={
        "": (m)=>{
            let o = {
                id: m.id,
                reference: m.reference,
                method: m.method,
                linkReference: m.linkReference,
                testOrderId: m.testOrderId,
                validationNoteId: m.validationNoteId,
                baseMemberEmail: m.baseMemberEmail,
                date: m.date,
                triggerer: BaseMemberDAO.getInstance().model_to_raw[""](m.triggerer),
                fileId: m.fileId,
                file: FileDAO.getInstance().model_to_raw[""](m.file)
            }
            return o
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
        },
        "file": (m)=>{
            let o = {
                ...this.model_to_raw[""](m), // Should be build in pair with the sql_to_model function
                file: FileDAO.getInstance().model_to_raw["content"](m.file)
            }
            return o
        },
        "edit": (m)=>{
            let o = {
                ...this.model_to_raw[""](m)
            }
            return o
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
        o.date = raw.date
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
            "paymentReceipt_testOrderId, paymentReceipt_fileId, paymentReceipt_date)" +
            " VALUES (?, ?, ?, ?, ?, ?)", [
            m.reference, m.method, m.linkReference, m.testOrderId, m.fileId, m.date
        ])
        m.id = d.insertId
        return m
    }

    async update(m){
        // File is not updatable
        await sqlExecute("" +
            "UPDATE `paymentReceipt` SET" +
            "   paymentReceipt_reference=?," +
            "   paymentReceipt_method=?," +
            "   paymentReceipt_linkReference=?," +
            "   paymentReceipt_validationNoteId=?," +
            "   paymentReceipt_testOrderId=?," +
            "   paymentReceipt_date=?," +
            "   paymentReceipt_fileId=?" +
            " WHERE paymentReceipt_id=?",
            [m.reference, m.method, m.linkReference, m.validationNoteId, m.testOrderId, m.date, m.fileId, m.id]
        )
    }
}
module.exports = PaymentReceiptDAO
