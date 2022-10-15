const BaseCrudDAO = require("./BaseCrudDAO");
const sqlExecute = require("../../utils/sqlExecute");
const ValidationNote = require("../../model/ValidationNote");
const sqlQueryOne = require("../../utils/sqlQueryOne");


class ValidationNoteDAO extends BaseCrudDAO{
    static instance = null;
    static getInstance(){
        if(this.instance == null) {
            this.instance = new ValidationNoteDAO()
        }
        return this.instance
    }
    static tearDown(){
        this.instance = null;
    }

    name = "baseMember"

    async buildTable(){
        await sqlExecute("" +
            "CREATE TABLE `validationNote` (" +
            "   validationNote_id INT(6) UNSIGNED AUTO_INCREMENT PRIMARY KEY," +
            "   validationNote_validated BOOLEAN," +
            "   validationNote_message TEXT," +
            "   validationNote_date DATETIME" +
            ")ENGINE = InnoDB CHARSET=utf8 COLLATE utf8_general_ci;;")

        // Views
        await sqlExecute("" +
            "CREATE VIEW `validationNote_` AS" +
            "   SELECT * from validationNote")
    }

    async destroyTable(){
        // View
        await sqlExecute("DROP VIEW IF EXISTS `validationNote_`")

        await sqlExecute("DROP TABLE IF EXISTS `validationNote`")
    }

    sql_search_string = {
        "": ""
    }

    sql_to_model={
        "": (r)=>{
            let o = new ValidationNote()
            o.id = r.validationNote_id
            o.validated = r.validationNote_validated
            o.message = r.validationNote_message
            o.date = r.validationNote_date
            return o
        }
    }

    model_to_raw={
        "": (m)=>{
            return {
                id: m.id,
                validated: m.validated,
                message: m.message,
                date: m.date
            }
        }
    }

    raw_to_model(raw){
        let o = new ValidationNote()
        o.id = raw.id
        o.validated = raw.validated
        o.message = raw.message
        o.date = raw.date
        return o
    }

    async getOne(view, id){
        if(view == undefined)
            view = "" // The default view
        let viewName = this.name + "_" + view
        return await sqlQueryOne(`SELECT * FROM ${viewName} WHERE validationNote_id=?`, [id], this.sql_to_model[view])
    }

    async add(m){
        if(m.date)
            m.date = m.date.toMysqlFormat()
        let d = await sqlExecute("" +
            "INSERT INTO `validationNote` (" +
            "validationNote_validated, validationNote_message, validationNote_date)" +
            " VALUES (?, ?, ?)", [
            m.validated, m.message, m.date
        ])
        m.id = d.insertId
        return d
    }

    async update(m){
        await sqlExecute("" +
            "UPDATE `validationNote` set" +
            "   validationNote_validated=?," +
            "   validationNote_message=?," +
            "   validationNote_date=?" +
            " WHERE validationNote_id=?",
            [m.validated, m.message, m.date, m.id])
    }
}
module.exports = ValidationNoteDAO
