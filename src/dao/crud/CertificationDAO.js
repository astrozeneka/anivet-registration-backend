const SciDocDAO = require("./SciDocDAO");
const sqlExecute = require("../../utils/sqlExecute");
const Certification = require("../../model/Certification");
const TestResultDAO = require("./TestResultDAO");
const ValidationNoteDAO = require("./ValidationNoteDAO");
const FileDAO = require("./FileDAO");
const TestOrderDAO = require("./TestOrderDAO");
const TestSampleDAO = require("./TestSampleDAO");
const BaseMemberDAO = require("./BaseMemberDAO");

class CertificationDAO extends SciDocDAO{
    static instance = null;
    static getInstance(){
        if(this.instance == null) {
            this.instance = new CertificationDAO()
        }
        return this.instance
    }
    static tearDown(){
        this.instance = null;
    }

    name = "certification"

    async buildTable(){
        await sqlExecute("" +
            "CREATE TABLE `certification` (" +
            "   certification_id INT(6) UNSIGNED AUTO_INCREMENT PRIMARY KEY," +
            "   certification_testResultId INT(6) UNSIGNED," +
            "   certification_validationNoteId INT(6) UNSIGNED," +
            "   certification_fileId INT(6) UNSIGNED," +
            "   CONSTRAINT `fk_certification_testResultId` FOREIGN KEY (certification_testResultId) REFERENCES testResult (testResult_id) ON DELETE SET NULL," +
            "   CONSTRAINT `fk_certification_validationNoteId` FOREIGN KEY (certification_validationNoteId) REFERENCES validationNote (validationNote_id) ON DELETE SET NULL," +
            "   CONSTRAINT `fk_certification_fileId` FOREIGN KEY (certification_fileId) REFERENCES file (file_id) ON DELETE SET NULL" +
            ")")

        let patch_baseMember_view = (slug)=>{
            return `  ${slug}.baseMember_id as ${slug}_id,` +
                `    ${slug}.baseMember_username as ${slug}_username,` +
                `    ${slug}.baseMember_website as ${slug}_website,` +
                `    ${slug}.baseMember_subscribe as ${slug}_subscribe,` +
                `    ${slug}.baseMember_name1 as ${slug}_name1,` +
                `    ${slug}.baseMember_name2 as ${slug}_name2,` +
                `    ${slug}.baseMember_phone as ${slug}_phone,` +
                `    ${slug}.baseMember_email as ${slug}_email,` +
                `    ${slug}.baseMember_corp as ${slug}_corp,` +
                `    ${slug}.baseMember_type as ${slug}_type`
        }
        let patch_file_view = (slug)=>{
            return ` ${slug}.file_id as ${slug}_id,` +
                ` ${slug}.file_type as ${slug}_type,` +
                ` ${slug}.file_name as ${slug}_name` +
                //` ${slug}.file_content as ${slug}_content` // Generally is null
                ``
        }
        await sqlExecute("" +
            "CREATE VIEW `certification_` AS" +
            " SELECT " +
            "   certification.*, " +
            "   testResult.*," +
            "   validationNote.*," +
            `   ${patch_file_view('file')},` + // Very important to use file_, not _
            "   sciDoc.*," +
            `   ${patch_file_view('testResultFile')},` +
            "   testSample.*," +
            "   testOrder.*," +
            `   ${patch_baseMember_view('customer')},` +
            `   ${patch_baseMember_view('triggerer')}`+
            " FROM certification" +
            " INNER JOIN testResult ON testResult_id=certification_testResultId" +
            " INNER JOIN validationNote ON validationNote_id=certification_validationNoteId" +
            " INNER JOIN file_ AS file ON file.file_id=certification_fileId" +
            " INNER JOIN sciDoc ON sciDoc_id=testResult_sciDocId" +
            " INNER JOIN file_ AS testResultFile ON testResultFile.file_id=sciDoc_fileId" + // For now testResult ไม่มีใฟล์
            " INNER JOIN testSample ON testSample_id=sciDoc_testSampleId" +
            " LEFT JOIN testOrder ON testOrder_id=testSample_testOrderId" +
            " LEFT JOIN baseMember AS customer ON customer.baseMember_id=testOrder_memberId" +
            " INNER JOIN baseMember AS triggerer ON triggerer.baseMember_id=validationNote_triggererId")
        await sqlExecute("" +
            "CREATE VIEW `certification_edit` AS" +
            "   SELECT * FROM certification_")
    }

    async destroyTable(){
        await sqlExecute("DROP VIEW IF EXISTS `certification_edit`")
        await sqlExecute("DROP VIEW IF EXISTS `certification_`")
        await sqlExecute("DROP TABLE IF EXISTS `certification`")
    }

    sql_search_string={
        "": "certification_id"
    }

    sql_to_model={
        "": (r)=>{
            let o = new Certification()
            o.id = r.certification_id
            o.testResultId = r.certification_testResultId
            o.validationNoteId = r.certification_validationNoteId
            o.fileId = r.certification_fileId
            o.testResult = TestResultDAO.getInstance().sql_to_model[""](r)
            o.validationNote = ValidationNoteDAO.getInstance().sql_to_model[""](r)
            o.file = FileDAO.getInstance().sql_to_model[""](r, "file")
            o.sciDoc = SciDocDAO.getInstance().sql_to_model[""](r)
            o.testResultFile = FileDAO.getInstance().sql_to_model[""](r, "testResultFile")
            o.testSample = TestSampleDAO.getInstance().sql_to_model[""](r)
            o.testOrder = TestOrderDAO.getInstance().sql_to_model[""](r)
            o.customer = BaseMemberDAO.getInstance().sql_to_model[""](r, "customer")
            o.triggerer = BaseMemberDAO.getInstance().sql_to_model[""](r, "triggerer")
            return o
        },
        "edit": (r)=>{
            return this.sql_to_model[""](r)
        }
    }

    model_to_raw={
        "": (m)=>{
            let o = {
                id: m.id,
                testResultId: m.testResultId,
                validationNoteId: m.validationNoteId,
                fileId: m.fileId,
                testResult: TestResultDAO.getInstance().model_to_raw[""](m.testResult),
                validationNote: ValidationNoteDAO.getInstance().model_to_raw[""](m.validationNote),
                file: FileDAO.getInstance().model_to_raw[""](m.file),
                sciDoc: SciDocDAO.getInstance().model_to_raw[""](m.sciDoc),
                testResultFile: FileDAO.getInstance().model_to_raw[""](m.testResultFile),
                testSample: TestSampleDAO.getInstance().model_to_raw[""](m.testSample),
                testOrder: TestOrderDAO.getInstance().model_to_raw[""](m.testOrder),
                customer: BaseMemberDAO.getInstance().model_to_raw[""](m.customer),
                triggerer: BaseMemberDAO.getInstance().model_to_raw[""](m.triggerer)
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

    raw_to_model(raw){
        let o = new Certification()
        o.id = raw.id
        o.testResultId = raw.testResultId
        o.validationNoteId = raw.validationNoteId
        o.fileId = raw.fileId
        return o
    }

    async add(m){
        let d = await sqlExecute("" +
            "INSERT INTO `certification` (certification_testResultId, certification_validationNoteId, certification_fileId)" +
            " VALUES (?, ?, ?)", [m.testResultId, m.validationNoteId, m.fileId])
        m.id = d.insertId
        return m
    }

    async update(m){
        let d = await sqlExecute("" +
            "UPDATE `certification` SET" +
            "   certification_testResultId=?," +
            "   certification_validationNoteId=?," +
            "   certification_fileId=?" +
            " WHERE certification_id=?",
            [m.testResultId, m.validationNoteId, m.fileId, m.id])
    }
}
module.exports = CertificationDAO
