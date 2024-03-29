const BaseDAO = require("./BaseDAO");
const PaymentReceipt = require("../model/PaymentReceipt");


class PaymentReceiptDAO extends BaseDAO{
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

    fromResultSet(r){
        let o = new PaymentReceipt()

        o.id = r.paymentReceipt_id
        o.reference = r.paymentReceipt_reference
        o.method = r.paymentReceipt_method
        o.linkReference = r.paymentReceipt_linkReference
        o.file = r.paymentReceipt_file

        o.validationNoteId = r.validationNote_id
        o.validationNoteValidated = r.validationNote_validated
        o.validationNoteMessage = r.validationNote_message
        o.validationNoteDate = r.validationNote_date
        o.validated = r.validationNote_validated

        o.testOrderId = r.testOrderId

        return o
    }

    async buildTable(){
        return new Promise((resolve, reject)=>{
            let o = this.connection.query("" +
                "CREATE TABLE `paymentReceipt` (" +
                "   paymentReceipt_id INT(6) UNSIGNED AUTO_INCREMENT PRIMARY KEY," +
                "   paymentReceipt_reference VARCHAR(255)," +
                "   paymentReceipt_method VARCHAR(255)," +
                "   paymentReceipt_linkReference VARCHAR(255)," +
                "   paymentReceipt_file LONGBLOB," +
                "   paymentReceipt_validationNoteId INT(6) UNSIGNED," +
                "   paymentReceipt_testOrderId INT(6) UNSIGNED," +
                "" +
                "   CONSTRAINT `fk_paymentReceipt_validationNoteId` FOREIGN KEY (paymentReceipt_validationNoteId) REFERENCES validationNote (validationNote_id) ON DELETE CASCADE," +
                "   CONSTRAINT `fk_paymentReceipt_testOrderId` FOREIGN KEY (paymentReceipt_testOrderId) REFERENCES testOrder (testOrder_id) ON DELETE CASCADE" +
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
                "DROP TABLE IF EXISTS `paymentReceipt`",
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
        return new Promise((resolve, reject)=>{
            this.connection.query("INSERT INTO `paymentReceipt` (" +
                "paymentReceipt_reference, paymentReceipt_method, paymentReceipt_linkReference," +
                "paymentReceipt_file, paymentReceipt_testOrderId)" +
                " VALUES (?, ?, ?, ?, ?)", [
                entity.reference, entity.method, entity.linkReference, entity.file, entity.testOrderId
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

    async getAll(){
        return new Promise((resolve, reject)=>{
            this.connection.query("SELECT paymentReceipt_id, paymentReceipt_reference, paymentReceipt_method, paymentReceipt_linkReference," +
                " validationNote_id, validationNote_message, validationNote_validated, paymentReceipt_testOrderId" +
                " FROM `paymentReceipt` " +
                " LEFT JOIN `validationNote` ON validationNote_id=paymentReceipt_validationNoteId", (err, res)=>{
                if(err){
                    throw err;
                    reject(err)
                }
                let output = []
                for(let rdp of res)
                    output.push(this.fromResultSet(rdp))
                resolve(output)
            })
        })
    }

    async getById(id){
        return new Promise((resolve, reject)=>{
            this.connection.query("SELECT * FROM `paymentReceipt` " +
                "LEFT JOIN `validationNote` ON validationNote_id=paymentReceipt_validationNoteId " +
                "WHERE paymentReceipt_id=?", [id], (err, res)=>{
                if(err){
                    throw err;
                    reject(err)
                }
                if(res.length == 0) resolve(null)
                resolve(this.fromResultSet(res[0]))
            })
        })
    }

    async update(entity){
        return new Promise((resolve, reject)=>{
            this.connection.query("" +
                "UPDATE `paymentReceipt` SET" +
                "   paymentReceipt_reference=?," +
                "   paymentReceipt_method=?," +
                "   paymentReceipt_linkReference=?," +
                "   paymentReceipt_validationNoteId=?," +
                "   paymentReceipt_testOrderId=?" +
                " WHERE paymentReceipt_id=?",
                [entity.reference, entity.method, entity.linkReference, entity.validationNoteId, entity.id],
                function(err, res){
                    if(err){
                        throw err;
                        reject(err)
                    }
                    resolve(res)
                })
        })
    }
}
module.exports = PaymentReceiptDAO
