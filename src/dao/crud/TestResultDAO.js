const SciDocDAO = require("./SciDocDAO");
const sqlExecute = require("../../utils/sqlExecute");
const TestResult = require("../../model/TestResult");
const FileDAO = require("./FileDAO");
const TestSampleDAO = require("./TestSampleDAO");
const BaseMemberDAO = require("./BaseMemberDAO");

/**
 * Related to a document (includes a triggerer)
 * And also to a sample
 */
class TestResultDAO extends SciDocDAO{
    static instance = null;
    static getInstance(){
        if(this.instance == null) {
            this.instance = new TestResultDAO()
        }
        return this.instance
    }
    static tearDown(){
        this.instance = null;
    }

    name = "testResult"

    async buildTable(){
        await sqlExecute("" +
            "CREATE TABLE `testResult` (" +
            "   testResult_id INT(6) UNSIGNED AUTO_INCREMENT PRIMARY KEY," +
            "   testResult_notes TEXT," +
            "   testResult_sciDocId INT(6) UNSIGNED," + // immutable
            "" +
            "   CONSTRAINT `fk_testResult_sciDocId` FOREIGN KEY (testResult_sciDocId) REFERENCES sciDoc (sciDoc_id) ON DELETE SET NULL" + // IMMUTABLE
            ")ENGINE = InnoDB CHARSET=utf8 COLLATE utf8_general_ci;")

        // Views
        await sqlExecute("" +
            "CREATE VIEW `testResult_` AS" +
            "   SELECT * FROM `testResult`" +
            "   INNER JOIN sciDoc_ ON sciDoc_id=testResult_sciDocId" +
            "   INNER JOIN testSample ON testSample_id=sciDoc_testSampleId") // the underscore is very important
        await sqlExecute("" +
            "CREATE VIEW `testResult_file` AS" +
            "   SELECT * FROM `testResult`" +
            "   INNER JOIN sciDoc ON sciDoc_id=testResult_sciDocId" +
            "   INNER JOIN testSample ON testSample_id=sciDoc_testSampleId" +
            "   INNER JOIN file ON file_id=sciDoc_fileId")
        await sqlExecute("" +
            "CREATE VIEW `testResult_edit` AS" +
            "   SELECT * FROM `testResult_`")
    }

    async destroyTable(){
        // Views
        await sqlExecute("DROP VIEW IF EXISTS `testResult_edit`")
        await sqlExecute("DROP VIEW IF EXISTS `testResult_file`")
        await sqlExecute("DROP VIEW IF EXISTS `testResult_`")

        await sqlExecute("DROP TABLE IF EXISTS `testResult`")
    }

    sql_search_string={
        "": "LOWER(CONCAT(sciDoc_reference))"
    }

    sql_to_model={
        "": (r)=>{
            let o = new TestResult()
            o.id = r.testResult_id
            o.notes = r.testResult_notes
            o.sciDocId = r.testResult_sciDocId
            o.sciDoc = SciDocDAO.getInstance().sql_to_model[""](r)
            o.sciDoc.testSample = TestSampleDAO.getInstance().sql_to_model[""](r) // Pay attention to the structure
            o.file = FileDAO.getInstance().sql_to_model[""](r)
            o.triggerer = BaseMemberDAO.getInstance().sql_to_model[""](r)
            return o
        },
        "file": (r)=>{
            let o = this.sql_to_model[""](r)
            o.file = FileDAO.getInstance().sql_to_model["content"](r)
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
                notes: m.notes,
                sciDocId: m.sciDocId,
                sciDoc: {
                    ...SciDocDAO.getInstance().model_to_raw[""](m.sciDoc),
                    testSample: TestSampleDAO.getInstance().model_to_raw[""](m.sciDoc.testSample),
                },
                file: FileDAO.getInstance().model_to_raw[""](m.file),
                triggerer: BaseMemberDAO.getInstance().model_to_raw[""](m.triggerer)
            }
            return o
        },
        "file": (m)=>{
            let o = this.model_to_raw[""](m)
            o.file = FileDAO.getInstance().model_to_raw["content"](m.file)
            return o
        },
        "edit": (m)=>{
            let o = this.model_to_raw[""](m)
            return o
        }
    }

    raw_to_model(raw){
        let o = new TestResult()
        o.id = raw.id
        o.notes = raw.notes
        o.sciDocId = raw.sciDocId
        return o
    }

    async add(m){
        let d = await sqlExecute(
            "INSERT INTO `testResult` (" +
            "testResult_notes, testResult_sciDocId) VALUES (?, ?)",
            [m.notes, m.sciDocId]
        )
        m.id = d.insertId
        return m
    }

    async update(m){
        await sqlExecute("" +
            "UPDATE `testResult` SET" +
            "   testResult_notes=?," +
            "   testResult_sciDocId=?" +
            " WHERE testResult_id=?",
            [m.notes, m.sciDocId, m.id])
    }
}
module.exports = TestResultDAO
