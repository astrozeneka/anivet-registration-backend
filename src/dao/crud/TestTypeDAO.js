const BaseCrudDAO = require("./BaseCrudDAO");
const sqlExecute = require("../../utils/sqlExecute");
const TestType = require("../../model/TestType");
const FileDAO = require("./FileDAO");

class TestTypeDAO extends BaseCrudDAO{
    static instance = null;
    static getInstance(){
        if(this.instance == null) {
            this.instance = new TestTypeDAO()
        }
        return this.instance
    }
    static tearDown(){
        this.instance = null;
    }

    name="testType"

    async buildTable(){
        await sqlExecute("" +
            "CREATE TABLE `testType` (" +
            "   testType_id INT(6) UNSIGNED AUTO_INCREMENT PRIMARY KEY," +
            "   testType_label VARCHAR(255)," +
            "   testType_slug VARCHAR(255)," +
            "   testType_description TEXT," +
            "   testType_price INT(6)," +
            "   testType_imageId INT(6) UNSIGNED NULL," +
            "   CONSTRAINT `fk_testType_imageId` FOREIGN KEY (testType_imageId) REFERENCES file (file_id) ON DELETE SET NULL" +
            ")")
        await sqlExecute("" +
            "CREATE VIEW `testType_` AS" +
            "   SELECT * FROM testType" +
            "   LEFT JOIN `file_` ON file_id=testType_imageId")
        await sqlExecute("" +
            "CREATE VIEW `testType_edit` AS" +
            "   SELECT * FROM testType" +
            "   LEFT JOIN `file_content` ON file_id=testType_imageId")
    }

    async destroyTable(){
        await sqlExecute("DROP VIEW IF EXISTS `testType_edit`")
        await sqlExecute("DROP VIEW IF EXISTS `testType_`")
        await sqlExecute("DROP TABLE IF EXISTS `testType`")
    }

    sql_search_string={
        "": "LOWER(CONCAT(testType_slug, testType_label))"
    }

    sql_to_model={
        "": (r)=>{
            let o = new TestType()
            o.id = r.testType_id
            o.label = r.testType_label
            o.slug = r.testType_slug
            o.description = r.testType_description
            o.price = r.testType_price
            o.imageId = r.testType_imageId
            o.image = FileDAO.getInstance().sql_to_model[""](r, "image")
            return o
        },
        "edit": (r)=>{
            let o = this.sql_to_model[""](r)
            o.file = FileDAO.getInstance().sql_to_model["content"](r, "image")
            return o
        }
    }

    model_to_raw={
        "": (m)=>{
            let o = {
                id: m.id,
                label: m.label,
                slug: m.slug,
                description: m.description,
                price: m.price,
                imageId: m.imageId,
                image: FileDAO.getInstance().sql_to_model[""](m.image)
            }
            return o
        },
        "edit": (m)=>{
            let o = {
                ...this.model_to_raw[""](m),
                image: FileDAO.getInstance().sql_to_model["content"](r.image)
            }
            return o
        }
    }

    raw_to_model(raw){
        let o = new TestType()
        o.id = raw.id
        o.label = raw.label
        o.slug = raw.slug
        o.description = raw.description
        o.price = raw.price
        o.imageId = raw.imageId
        return o
    }

    async add(m){
        let d = await sqlExecute("" +
            "INSERT INTO `testType` (testType_label, testType_slug, testType_description, testType_price, testType_imageId)" +
            " VALUES (?, ?, ?, ?, ?)", [m.label, m.slug, m.description, m.price, m.imageId])
        m.id = d.insertId
        return m
    }

    async update(m){
        await sqlExecute("" +
            "UPDATE `testType` set" +
            "   testSample_label=?," +
            "   testSample_slug=?," +
            "   testSample_description=?," +
            "   testSample_price=?," +
            "   testSample_imageId=?" +
            " WHERE testSample_id=?", [m.label, m.slug, m.description, m.price, m.imageId, m.id])
        return m
    }
}

module.exports = TestTypeDAO
