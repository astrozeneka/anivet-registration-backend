const BaseCrudDAO = require("./BaseCrudDAO");
const sqlExecute = require("../../utils/sqlExecute");
const TestOrder = require("../../model/TestOrder");
const BaseMemberDAO = require("./BaseMemberDAO");
const ValidationNoteDAO = require("./ValidationNoteDAO");

class TestOrderDAO extends BaseCrudDAO{
    static instance = null;
    static getInstance(){
        if(this.instance == null) {
            this.instance = new TestOrderDAO()
        }
        return this.instance
    }
    static tearDown(){
        this.instance = null;
    }

    name="testOrder"

    async buildTable(){
        await sqlExecute("" +
            "CREATE TABLE `testOrder` (" +
            "   testOrder_id INT(6) UNSIGNED AUTO_INCREMENT PRIMARY KEY," +
            "   testOrder_name1 VARCHAR(255)," +
            "   testOrder_name2 VARCHAR(255)," +
            "   testOrder_website VARCHAR(255)," +
            "   testOrder_email VARCHAR(255)," +
            "   testOrder_memberId INT(6) UNSIGNED," +
            "   testOrder_validationNoteId INT(6) UNSIGNED," +
            "   testOrder_notes TEXT," +
            "   testOrder_date DATETIME," +
            "   " + // NULLABLE
            "" +
            "   CONSTRAINT `fk_to_memberId` FOREIGN KEY (testOrder_memberId) REFERENCES baseMember (baseMember_id) ON DELETE CASCADE," +
            "   CONSTRAINT `fk_testOrder_validationNoteId` FOREIGN KEY (testOrder_validationNoteId) REFERENCES validationNote (validationNote_id) ON DELETE CASCADE" +
            ")ENGINE = InnoDB CHARSET=utf8 COLLATE utf8_general_ci;;")

        // views
        // Views are on testSampleDAO
        // Circular dependency
        // Views has been constructed in TestSampleDAO code fragment
    }
    async _buildTable(){
        /// Deffered construction (should be called manually)
        await sqlExecute("" +
            "CREATE VIEW `testOrder_` AS" +
            "   SELECT *, COUNT(testSample_id) AS testOrder_sampleCount FROM testOrder" +
            "   LEFT JOIN baseMember ON baseMember_id=testOrder_memberID" +
            "   LEFT JOIN validationNote ON validationNote_id=testOrder_validationNoteId" +
            "   LEFT JOIN testSample ON testSample_testOrderId=testOrder_id" +
            "       GROUP BY testOrder_id")
        await sqlExecute("" +
            "CREATE VIEW `testOrder_validation` AS" +
            "   SELECT  *, " +
            "           COUNT(testSample_id) AS testOrder_sampleCount" +
            "   FROM testOrder" +
            "   LEFT JOIN `baseMember` ON baseMember_id=testOrder_memberId" +
            "   LEFT JOIN `validationNote` ON testOrder_validationNoteId=validationNote_id" +
            "   LEFT JOIN testSample ON testSample_testOrderId=testOrder_id" +
            "       GROUP BY testOrder_id")
        await sqlExecute("" +
            "CREATE VIEW `testOrder_validation_details` AS" +
            "   SELECT * FROM testOrder_validation")
        await sqlExecute("" +
            "CREATE VIEW `testOrder_edit` AS" +
            "   SELECT * FROM testOrder_")
    }

    async destroyTable(){
        // Circular dependency
        // Views has been constructed in TestSampleDAO code fragment

        await sqlExecute("" +
            "DROP TABLE IF EXISTS `testOrder`")
    }

    async _destroyTable(){
        await sqlExecute("" +
            "DROP VIEW IF EXISTS `testOrder_edit`")
        await sqlExecute("" +
            "DROP VIEW IF EXISTS `testOrder_validation_details`")
        await sqlExecute("" +
            "DROP VIEW IF EXISTS `testOrder_validation`")
        await sqlExecute("" +
            "DROP VIEW IF EXISTS `testOrder_`")
    }

    sql_search_string={
        "": "LOWER(CONCAT(testOrder_id))",
        "memberId": "testOrder_memberId"
    }

    sql_to_model={
        "": (r)=>{
            let o = new TestOrder()
            o.id = r.testOrder_id
            o.name1 = r.testOrder_name1 // deprecated
            o.name2 = r.testOrder_name2 // deprecated
            o.website = r.testOrder_website // deprecated
            o.email = r.testOrder_email // deprecated
            o.memberId = r.testOrder_memberId // only this will be used for fetching related data
            o.validationNoteId = r.testOrder_validationNoteId // used for fetching related data
            o.notes = r.testOrder_notes
            o.date = r.testOrder_date
            o.sampleCount = r.testOrder_sampleCount
            o.member = BaseMemberDAO.getInstance().sql_to_model[""](r)
            o.validationNote = ValidationNoteDAO.getInstance().sql_to_model[""](r)
            return o
        },
        "validation": (r)=>{
            let o = this.sql_to_model[""](r)
            o.sampleCount = r.testOrder_sampleCount
            o.baseMember = BaseMemberDAO.getInstance().sql_to_model[""](r)
            o.validationNote = ValidationNoteDAO.getInstance().sql_to_model[""](r)
            return o
        },
        "validation_details": (r)=>{
            let o = this.sql_to_model["validation"](r)
            return o
        },
        "edit": (r)=>{
            return this.sql_to_model[""](r)
        }
    }

    model_to_raw={
        "": (m)=>{
            return {
                id: m.id,
                name1: m.name1,
                name2: m.name2,
                website: m.website,
                email: m.email,
                memberId: m.memberId,
                validationNoteId: m.validationNoteId,
                sampleCount: m.sampleCount,
                notes: m.notes,
                date: m.date,
                member: BaseMemberDAO.getInstance().model_to_raw[""](m.member),
                validationNote: ValidationNoteDAO.getInstance().model_to_raw[""](m.validationNote)
            }
        },
        "validation": (m)=>{
            let o = {
                ...this.model_to_raw[""](m),
                sampleCount: m.sampleCount,
                baseMember: BaseMemberDAO.getInstance().model_to_raw[""](m.baseMember),
                validationNote: ValidationNoteDAO.getInstance().model_to_raw[""](m.validationNote)
            }
            return o
        },
        "validation_details": (m)=>{
            let o = {
                ...this.model_to_raw["validation"](m)
            }
            return o
        },
        "edit": (m)=>{
            let o = this.model_to_raw[""](m)
            return o
        }
    }

    raw_to_model(raw){// For insertion and update
        let o = new TestOrder()
        o.id = raw.id
        o.name1 = raw.name1
        o.name2 = raw.name2
        o.website = raw.website
        o.email = raw.email
        o.memberId = raw.memberId
        o.validationNoteId = raw.validationNoteId
        o.notes = raw.notes
        o.date = raw.date
        return o
    }

    async add(m){
        let d = await sqlExecute("" +
            "INSERT INTO `testOrder` (testOrder_name1, testOrder_name2, testOrder_website, testOrder_email, testOrder_memberId, testOrder_notes, testOrder_date) VALUES (?, ?, ?, ?, ?, ?, ?)",
            [m.name1, m.name2, m.website, m.email, m.memberId, m.notes, m.date])
        m.id = d.insertId
        return m
    }

    async update(m){
        let d = await sqlExecute("" +
            "UPDATE `testOrder` SET" +
            "   testOrder_name1=?," +
            "   testOrder_name2=?," +
            "   testOrder_website=?," +
            "   testOrder_email=?," +
            "   testOrder_validationNoteId=?," +
            "   testOrder_memberId=?," +
            "   testOrder_notes=?," +
            "   testOrder_date=?"+
            " WHERE testOrder_id=?",
            [m.name1, m.name2, m.website, m.email, m.validationNoteId, m.memberId, m.notes, m.date, m.id])
    }
}
module.exports = TestOrderDAO
