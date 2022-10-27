const BaseCrudDAO = require("./BaseCrudDAO");
const sqlExecute = require("../../utils/sqlExecute");
const SampleParcel = require("../../model/SampleParcel");
const TestSample = require("../../model/TestSample");
const TestSampleDAO = require("./TestSampleDAO");
const BaseMemberDAO = require("./BaseMemberDAO");
const FileDAO = require("./FileDAO");


class SampleParcelDAO extends BaseCrudDAO{
    static instance = null;
    static getInstance(){
        if(this.instance == null) {
            this.instance = new SampleParcelDAO()
        }
        return this.instance
    }
    static tearDown(){
        this.instance = null;
    }

    name = "sampleParcel"
    async buildTable(){
        await sqlExecute("" +
            "CREATE TABLE `sampleParcel` (" +
            "   sampleParcel_id INT(6) UNSIGNED AUTO_INCREMENT PRIMARY KEY," +
            "   sampleParcel_reference VARCHAR(255)," +
            "   sampleParcel_deliveryService VARCHAR(255)," +
            "   sampleParcel_testSampleId INT(6) UNSIGNED," +
            "   sampleParcel_triggererId INT(6) UNSIGNED," +
            "   sampleParcel_date DATETIME," +
            "   sampleParcel_fileId INT(6) UNSIGNED NULL," +
            "" +
            "   CONSTRAINT `fk_sampleParcel_testSampleId` FOREIGN KEY (sampleParcel_testSampleId) REFERENCES testSample (testSample_id) ON DELETE SET NULL," +
            "   CONSTRAINT `fk_sampleParcel_triggererId` FOREIGN KEY (sampleParcel_triggererId) REFERENCES baseMember (baseMember_id) ON DELETE SET NULL," +
            "   CONSTRAINT `fk_sampleParcel_fileId` FOREIGN KEY (sampleParcel_fileId) REFERENCES file (file_id) ON DELETE SET NULL" +
            ")" +
            "ENGINE = InnoDB CHARSET=utf8 COLLATE utf8_general_ci;;",)

        /**
         * Build views
         */
        await sqlExecute("" +
            "CREATE VIEW `sampleParcel_` AS" +
            "   SELECT * FROM `sampleParcel`" +
            "   LEFT JOIN testSample ON testSample_id=sampleParcel_testSampleId" +
            "   LEFT JOIN baseMember ON baseMember_id=sampleParcel_triggererId" +
            "   LEFT JOIN file_ ON file_id=sampleParcel_fileId") // -> _ คือที่สำคัณที่สุด
        await sqlExecute("" +
            "CREATE VIEW `sampleParcel_file` AS" +
            "   SELECT * FROM `sampleParcel`" +
            "   LEFT JOIN testSample ON testSample_id=sampleParcel_testSampleId" +
            "   LEFT JOIN baseMember ON baseMember_id=sampleParcel_triggererId" +
            "   LEFT JOIN file ON file_id=sampleParcel_fileId") // -> ไม่มี _
        await sqlExecute("" +
            "CREATE VIEW `sampleParcel_edit` AS" +
            "   SELECT * FROM `sampleParcel_`") // -> _ คือที่สำคัณที่สุด
    }

    async destroyTable(){
        // Views
        await sqlExecute("DROP VIEW IF EXISTS `sampleParcel_edit`")
        await sqlExecute("DROP VIEW IF EXISTS `sampleParcel_file`")
        await sqlExecute("DROP VIEW IF EXISTS `sampleParcel_`")

        // Table
        await sqlExecute("DROP TABLE IF EXISTS `sampleParcel`")
    }

    sql_search_string={
        "": "LOWER(CONCAT(sampleParcel_reference, ' ', sampleParcel_deliveryService, ' '))"
    }

    sql_to_model={
        "": (r)=>{
            let o = new SampleParcel()
            o.id = r.sampleParcel_id
            o.reference = r.sampleParcel_reference
            o.deliveryService = r.sampleParcel_deliveryService
            o.testSampleId = r.sampleParcel_testSampleId
            o.triggererId = r.sampleParcel_triggererId
            o.date = r.sampleParcel_date
            o.fileId = r.sampleParcel_fileId
            o.testSample = TestSampleDAO.getInstance().sql_to_model[""](r)
            o.triggerer = BaseMemberDAO.getInstance().sql_to_model[""](r)
            o.file = FileDAO.getInstance().sql_to_model[""](r)
            return o
        },
        "edit": (r)=>{
            return this.sql_to_model[""](r)
        },
        "file": (r)=>{
            let o = this.sql_to_model[""](r)
            o.file = FileDAO.getInstance().sql_to_model["content"](r) // very important
            return o
        }
    }

    model_to_raw={
        "": (m)=>{
            let o = {
                id: m.id,
                reference: m.reference,
                deliveryService: m.deliveryService,
                testSampleId: m.testSampleId,
                triggererId: m.triggererId,
                date: m.date,
                fileId: m.fileId,
                testSample: TestSampleDAO.getInstance().model_to_raw[""](m.testSample),
                triggerer: BaseMemberDAO.getInstance().model_to_raw[""](m.triggerer),
                file: FileDAO.getInstance().model_to_raw[""](m.file)
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
        let o = new SampleParcel()
        o.id = raw.id
        o.reference = raw.reference
        o.deliveryService = raw.deliveryService
        o.testSampleId = raw.testSampleId
        o.triggererId = raw.triggererId
        o.date = raw.date
        o.fileId = raw.fileId
        return o
    }

    async add(m){
        let d = await sqlExecute(
            "INSERT INTO `sampleParcel` (" +
            "sampleParcel_reference, sampleParcel_deliveryService, sampleParcel_testSampleId," +
            "sampleParcel_triggererId, sampleParcel_date, sampleParcel_fileId)" +
            " VALUES (?, ?, ?, ?, ?, ?)", [
                m.reference, m.deliveryService, m.testSampleId, m.triggererId, m.date, m.fileId
            ]
        )
        m.id = d.insertId
        return m
    }

    async update(m){
        await sqlExecute("" +
            "UPDATE `sampleParcel` SET" +
            "   sampleParcel_reference=?," +
            "   sampleParcel_deliveryService=?," +
            "   sampleParcel_testSampleId=?," +
            "   sampleParcel_triggererId=?," +
            "   sampleParcel_date=?," +
            "   sampleParcel_fileId=?" +
            " WHERE sampleParcel_id=?", [m.reference, m.deliveryService, m.testSampleId, m.triggererId, m.date, m.fileId, m.id])
    }
}
module.exports = SampleParcelDAO
