const BaseDAO = require("./BaseDAO");
const ValidationNote = require("../model/ValidationNote");

class ValidationNoteDAO extends BaseDAO {
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

    fromResultSet(r){
        let o = new ValidationNote()
        o.id = r.validationNote_id
        o.validated = r.validationNote_validated
        o.message = r.validationNote_message
        o.date = r.validationNote_date
        return o
    }

    async buildTable(){
        return new Promise((resolve, reject)=>{
            let o = this.connection.query("" +
                "CREATE TABLE `validationNote` (" +
                "   validationNote_id INT(6) UNSIGNED AUTO_INCREMENT PRIMARY KEY," +
                "   validationNote_validated BOOLEAN," +
                "   validationNote_message TEXT," +
                "   validationNote_date DATETIME" +
                ")" +
                "ENGINE = InnoDB CHARSET=utf8 COLLATE utf8_general_ci;;",
                function(err, res){
                    if(err){
                        reject(err)
                        throw(err)
                    }
                    resolve(res)
                }
            )
        })
    }

    async destroyTable(){
        return new Promise((resolve, reject)=>{
            let o = this.connection.query("" +
                "DROP TABLE IF EXISTS `validationNote`",
                function(err, res){
                    if(err){
                        reject(err)
                        throw(err)
                    }
                    resolve(res)
                }
            )
        })
    }

    async add(entity){
        let date = ""
        if(entity.date == undefined || entity.date == null)
            date = null
        else
            date = entity.date.toMysqlFormat()
        return new Promise((resolve, reject)=>{
            this.connection.query("INSERT INTO `validationNote` (" +
                "validationNote_validated, validationNote_message, validationNote_date)" +
                " VALUES (?, ?, ?)", [
                entity.validated, entity.message, date
            ], function (err, res){
                if(err){
                    throw err;
                    reject(err)
                }
                entity.id = res.insertId
                resolve(res)
            })
        })
    }
}
module.exports = ValidationNoteDAO
