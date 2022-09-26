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
                "   paymentReceipt_file LONGBLOB" +
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
                "paymentReceipt_file)" +
                " VALUES (?, ?, ?, ?)", [
                entity.reference, entity.method, entity.linkReference, entity.file
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
module.exports = PaymentReceiptDAO
