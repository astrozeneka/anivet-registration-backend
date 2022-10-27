const BaseCrudDAO = require("./BaseCrudDAO");
const sqlExecute = require("../../utils/sqlExecute");
const SciDoc = require("../../model/SciDoc");
const sqlQueryOne = require("../../utils/sqlQueryOne");
const BaseMemberDAO = require("./BaseMemberDAO");
const FileDAO = require("./FileDAO");

class SciDocDAO extends BaseCrudDAO{
    static instance = null;
    static getInstance(){
        if(this.instance == null) {
            this.instance = new SciDocDAO()
        }
        return this.instance
    }
    static tearDown(){
        this.instance = null;
    }

    name = "sciDoc"

    async buildTable(){
        await sqlExecute("" +
            "CREATE TABLE `sciDoc` (" +
            "   sciDoc_id INT(6) UNSIGNED AUTO_INCREMENT PRIMARY KEY," +
            "   sciDoc_reference VARCHAR(255)," +
            "   sciDoc_type VARCHAR(255)," +
            "   sciDoc_testSampleId INT(6) UNSIGNED," +
            "   sciDoc_triggererId INT(6) UNSIGNED," +
            "   sciDoc_date DATETIME," +
            "   sciDoc_fileId INT(6) UNSIGNED NULL," +
            "" +
            "   CONSTRAINT `fk_sciDoc_testSampleId` FOREIGN KEY (sciDoc_testSampleId) REFERENCES testSample (testSample_id) ON DELETE CASCADE," +
            "   CONSTRAINT `fk_sciDoc_triggererId` FOREIGN KEY (sciDoc_triggererId) REFERENCES baseMember (baseMember_id) ON DELETE CASCADE," +
            "   CONSTRAINT `fk_sciDoc_fileId` FOREIGN KEY (sciDoc_fileId) REFERENCES file (file_id) ON DELETE SET NULL" +
            ")" +
            "ENGINE = InnoDB CHARSET=utf8 COLLATE utf8_general_ci;;")

        // Views
        await sqlExecute("" +
            "CREATE VIEW `sciDoc_` AS" +
            "   SELECT " +
            "       sciDoc_id, sciDoc_reference, sciDoc_type, sciDoc_testSampleId," +
            "       sciDoc_triggererId, sciDoc_date, sciDoc_fileId," +
            "" +
            "       baseMember_id, baseMember_username," + // Triggerer
            "       file_id, file_type, file_name" + // Related file
            "   FROM sciDoc" +
            "   INNER JOIN baseMember ON baseMember_id=sciDoc_triggererId" +
            "   INNER JOIN file ON sciDoc_fileId = file_id")
        await sqlExecute("" +
            "CREATE VIEW `sciDoc_file` AS" +
            "   SELECT * FROM sciDoc" +
            "   INNER JOIN file ON sciDoc_fileId = file_id")
        await sqlExecute("" +
            "CREATE VIEW `sciDoc_edit` AS" +
            "   SELECT " +
            "       sciDoc_id, sciDoc_reference, sciDoc_type, sciDoc_testSampleId," +
            "       sciDoc_triggererId, sciDoc_date, sciDoc_fileId," +
            "" +
            "       baseMember_id, baseMember_username," + // Triggerer
            "       file_id, file_type, file_name" + // Related file
            " FROM sciDoc_" +
            "")
    }

    async destroyTable(){
        // View
        await sqlExecute("" +
            "DROP VIEW IF EXISTS `sciDoc_edit`")
        await sqlExecute("" +
            "DROP VIEW IF EXISTS `sciDoc_file`")
        await sqlExecute("" +
            "DROP VIEW IF EXISTS `sciDoc_`")

        await sqlExecute("" +
            "DROP TABLE IF EXISTS `sciDoc`")
    }

    sql_search_string= {
        "": "LOWER(CONCAT(sciDoc_reference, sciDoc_type))"
    }

    sql_to_model={
        "": (r)=>{
            let o = new SciDoc()
            o.id = r.sciDoc_id
            o.reference = r.sciDoc_reference
            o.type = r.sciDoc_type
            o.testSampleId = r.sciDoc_testSampleId
            o.triggererId = r.sciDoc_triggererId
            o.date = r.sciDoc_date
            o.fileId = r.sciDoc_fileId
            o.triggerer = BaseMemberDAO.getInstance().sql_to_model[""](r)
            o.file = FileDAO.getInstance().sql_to_model[""](r)
            return o
        },
        "file": (r)=>{
            let o = SciDocDAO.getInstance().sql_to_model[""](r)
            o.file = FileDAO.getInstance().sql_to_model["content"](r)
            return o
        },
        "edit": (r)=>{
            let o = SciDocDAO.getInstance().sql_to_model[""](r)
            o.file = FileDAO.getInstance().sql_to_model[""](r)
            return o
        }
    }

    model_to_raw={
        "": (m)=>{
            let o = {
                id: m.id,
                reference: m.reference,
                type: m.type,
                testSampleId: m.testSampleId,
                triggererId: m.triggererId,
                date: m.date,
                fileId: m.fileId,
                triggerer: BaseMemberDAO.getInstance().model_to_raw[""](m.triggerer),
                file: FileDAO.getInstance().model_to_raw[""](m.file)
            }
            return o
        },
        "file": (m)=>{
            let o = {
                ...SciDocDAO.getInstance().model_to_raw[""](m),
                file: FileDAO.getInstance().model_to_raw["content"](m.file)
            }
            return o
        },
        "edit": (m)=>{
            let o = {
                ...SciDocDAO.getInstance().model_to_raw[""](m),
                file: FileDAO.getInstance().model_to_raw[""](m.file)
            }
            return o
        }
    }

    raw_to_model(raw){
        let o = new SciDoc()
        o.id = raw.id // or update (important)
        o.reference = raw.reference
        o.type = raw.type
        o.testSampleId = raw.testSampleId
        o.triggererId = raw.triggererId
        o.date = raw.date
        o.fileId = raw.fileId
        return o
    }

    async add(m){
        let d = await sqlExecute("" +
            "INSERT INTO `sciDoc` (" +
            "   sciDoc_reference, sciDoc_type, sciDoc_testSampleId," +
            "   sciDoc_triggererId, sciDoc_date, sciDoc_fileId" +
            ") VALUES (?, ?, ?, ?, ?, ?)",
            [m.reference, m.type, m.testSampleId,
            m.triggererId, m.date, m.fileId])
        m.id = d.insertId
        return m
    }

    async update(m){
        await sqlExecute("" +
            "UPDATE `sciDoc` SET" +
            "   sciDoc_reference=?," +
            "   sciDoc_type=?," +
            "   sciDoc_testSampleId=?," +
            "   sciDoc_triggererId=?," +
            "   sciDoc_date=?," +
            "   sciDoc_fileId=?" +
            " WHERE sciDoc_id=?",
            [m.reference, m.type, m.testSampleId, m.triggererId, m.date, m.fileId,
            m.id])
    }
}
module.exports = SciDocDAO
