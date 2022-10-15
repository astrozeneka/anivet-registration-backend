const BaseCrudDAO = require("./BaseCrudDAO");
const sqlExecute = require("../../utils/sqlExecute");
const TestSample = require("../../model/TestSample");
const BaseMemberDAO = require("./BaseMemberDAO");
const TestOrderDAO = require("./TestOrderDAO");
const ValidationNoteDAO = require("./ValidationNoteDAO");
const sqlQueryMultiple = require("../../utils/sqlQueryMultiple");

class TestSampleDAO extends BaseCrudDAO{
    static instance = null;
    static getInstance(){
        if(this.instance == null) {
            this.instance = new TestSampleDAO()
        }
        return this.instance
    }
    static tearDown(){
        this.instance = null;
    }

    name="testSample"

    async buildTable(){
        await sqlExecute("" +
            "CREATE TABLE `testSample` (" +
            "   testSample_id INT(6) UNSIGNED AUTO_INCREMENT PRIMARY KEY," +
            "   testSample_animal VARCHAR(255)," +
            "   testSample_type VARCHAR(255)," +
            "   testSample_petId int(6)," +
            "   testSample_petSpecie VARCHAR(255)," + // Combine with pet
            "   testSample_test VARCHAR(255)," +
            "   testSample_sampleType VARCHAR(255)," +
            "   testSample_image int(6)," +
            "   testSample_testOrderId int(6) UNSIGNED," +
            "   testSample_trackingTypeId INT(6) UNSIGNED," +
            "   testSample_progress INT(6) UNSIGNED DEFAULT 0," +
            "   testSample_validationNoteId INT(6) UNSIGNED,"+ // The step used for tracking
            "   CONSTRAINT `fk_testOrderId` FOREIGN KEY (testSample_testOrderId) REFERENCES testOrder (testOrder_id) ON DELETE CASCADE," +
            "   CONSTRAINT `fk_trackingTypeId_ts` FOREIGN KEY (testSample_trackingTypeId) REFERENCES trackingType (trackingType_id) ON DELETE CASCADE," +
            "   CONSTRAINT `fk_testSample_validationNoteId` FOREIGN KEY (testSample_validationNoteId) REFERENCES validationNote (validationNote_id) ON DELETE CASCADE" +
            ")ENGINE = InnoDB CHARSET=utf8 COLLATE utf8_general_ci;")

        // View
        await sqlExecute("" +
            "CREATE VIEW `testSample_` AS" +
            "   SELECT * FROM testSample")
        await sqlExecute("" +
            "CREATE VIEW `testSample_validation` AS" +
            "   SELECT * FROM testSample" +
            "   LEFT JOIN `testOrder` ON testOrder_id=testSample_testOrderId" +
            "   LEFT JOIN `baseMember` ON baseMember_id=testOrder_memberId" +
            "   LEFT JOIN `validationNote` ON validationNote_id=testSample_validationNoteId")
        await sqlExecute("" +
            "CREATE VIEW `testSample_validation_details` AS" +
            "   SELECT * FROM testSample" +
            "   LEFT JOIN `testOrder` ON testOrder_id=testSample_testOrderId" +
            "   LEFT JOIN `baseMember` ON baseMember_id=testOrder_memberId" +
            "   LEFT JOIN `validationNote` ON validationNote_id=testSample_validationNoteId")

        // TestOrderDAO
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
    }

    async destroyTable(){

        // Views for TestOrder
        await sqlExecute("" +
            "DROP VIEW IF EXISTS `testOrder_validation_details`")
        await sqlExecute("" +
            "DROP VIEW IF EXISTS `testOrder_validation`")
        await sqlExecute("" +
            "DROP VIEW IF EXISTS `testOrder_`")

        // Views
        await sqlExecute("DROP VIEW IF EXISTS `testSample_validation_details`")
        await sqlExecute("DROP VIEW IF EXISTS `testSample_validation`")
        await sqlExecute("DROP VIEW IF EXISTS `testSample_`")

        // Table
        await sqlExecute("DROP TABLE IF EXISTS `testSample`")
    }

    sql_search_string={
        "":"LOWER(CONCAT(testSample_animal, ' ', testSample_type, ' ', testSample_petId, ' ', testSample_petSpecie, ' '," +
            "testSample_sampleType)"
    }

    sql_to_model={
        "": (r)=>{
            let o = new TestSample()
            o.id = r.testSample_id
            o.animal = r.testSample_animal
            o.type = r.testSample_type
            o.petId = r.testSample_petId
            o.petSpecie = r.testSample_petSpecie
            o.test = r.testSample_test
            o.sampleType = r.testSample_sampleType
            o.image = r.testSample_image
            o.testOrderId = r.testSample_testOrderId
            o.trackingTypeId = r.testSample_trackingTypeId
            o.progress = r.testSample_progress
            o.validationNoteId = r.testSample_validationNoteId
            return o
        },
        "validation": (r)=>{
            let o = this.sql_to_model[""](r)
            o.validationNote = ValidationNoteDAO.getInstance().sql_to_model[""](r)
            o.baseMember = BaseMemberDAO.getInstance().sql_to_model[""](r)
            o.testOrder = TestOrderDAO.getInstance().sql_to_model[""](r)
            return o
        },
        "validation_details": (r)=>{
            let o = this.sql_to_model["validation"](r)
            return o
        }
    }

    model_to_raw={
        "": (m)=>{
            return {
                id: m.id,
                animal: m.animal,
                type: m.type,
                petId: m.petId,
                petSpecie: m.petSpecie,
                test: m.test,
                sampleType: m.sampleType,
                image: m.image,
                testOrderId: m.testOrderId,
                trackingTypeId: m.trackingTypeId,
                progress: m.progress,
                validationNoteId: m.validationNoteId
            }
        },
        "validation": (m)=>{
            let o = {
                ...this.model_to_raw[""](m),
                baseMember: BaseMemberDAO.getInstance().model_to_raw[""](m.baseMember),
                testOrder: TestOrderDAO.getInstance().model_to_raw[""](m.testOrder),
                validationNote: ValidationNoteDAO.getInstance().model_to_raw[""](m.validationNote)
            }
            return o
        },
        "validation_details": (m)=>{
            let o = {
                ...this.model_to_raw["validation"](m)
            }
            return o
        }
    }

    raw_to_model(raw){// For insertion and update only
        let o = new TestSample()
        o.id = raw.id
        o.animal = raw.animal
        o.type = raw.type
        o.petId = raw.petId
        o.petSpecie = raw.petSpecie
        o.test = raw.test
        o.sampleType = raw.sampleType
        o.image = raw.image
        o.testOrderId = raw.testOrderId
        o.trackingTypeId = raw.trackingTypeId
        o.progress = raw.trackingTypeId
        o.validationNoteId = raw.validationNoteId
        return o
    }

    async add(m){
        let d = await sqlExecute("" +
            "INSERT INTO `testSample` (testSample_animal, testSample_type, testSample_petId, " +
            "testSample_petSpecie, testSample_test, testSample_sampleType, testSample_image, testSample_testOrderId) VALUES (?, ?, ?, ?, ?, ?, ?, ?)", [
            m.animal, m.type, m.petId, m.petSpecie, m.test, m.sampleType, m.image, m.testOrderId
        ])
        m.id = d.insertId
        return m
    }

    async update(m){
        await sqlExecute("" +
            "UPDATE `testSample` SET" +
            "   testSample_animal=?," +
            "   testSample_type=?," +
            "   testSample_petId=?," +
            "   testSample_petSpecie=?," +
            "   testSample_test=?," +
            "   testSample_sampleType=?," +
            "   testSample_image=?," +
            "   testSample_testOrderId=?," +
            "   testSample_progress=?," +
            "   testSample_validationNoteId=?" +
            " WHERE testSample_id=?",
            [m.animal, m.type, m.petId, m.petSpecie, m.test, m.sampleType, m.image,
                m.testOrderId, m.progress, m.validationNoteId, m.id])
    }

    async getAllByTestOrderId(view, offset, limit, testOrderId){
        if(view == undefined)
            view = "" // The default view
        let viewName = this.name + "_" + view
        let suffix = (offset!=undefined&&limit!=undefined)?` LIMIT ${limit} OFFSET ${offset}`:``
        return await sqlQueryMultiple(`SELECT * FROM ${viewName} WHERE testSample_testOrderId=? ${suffix}`, [testOrderId], this.sql_to_model[view])
    }
}
module.exports = TestSampleDAO
