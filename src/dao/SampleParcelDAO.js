const BaseDAO = require("./BaseDAO");
const SampleParcel = require("../model/SampleParcel");

class SampleParcelDAO extends BaseDAO{
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

    fromResultSet(r){
        let o = new SampleParcel()
        o.id = r.sampleParcel_id
        o.reference = r.sampleParcel_reference
        o.deliveryService = r.sampleParcel_deliveryService
        o.testSampleId = r.sampleParcel_testSampleId
        o.triggererId = r.sampleParcel_triggererId
        o.date = r.sampleParcel_date
        o.file = r.sampleParcel_file
        return o
    }

    async buildTable(){
        return new Promise((resolve, reject)=>{
            let o = this.connection.query("" +
                "CREATE TABLE `sampleParcel` (" +
                "   sampleParcel_id INT(6) UNSIGNED AUTO_INCREMENT PRIMARY KEY," +
                "   sampleParcel_reference VARCHAR(255)," +
                "   sampleParcel_deliveryService VARCHAR(255)," +
                "   sampleParcel_testSampleId INT(6) UNSIGNED," +
                "   sampleParcel_triggererId INT(6) UNSIGNED," +
                "   sampleParcel_date DATETIME," +
                "   sampleParcel_file LONGBLOB," +
                "" +
                "   CONSTRAINT `fk_sampleParcel_testSampleId` FOREIGN KEY (sampleParcel_testSampleId) REFERENCES testSample (testSample_id) ON DELETE CASCADE," +
                "   CONSTRAINT `fk_sampleParcel_triggererId` FOREIGN KEY (sampleParcel_triggererId) REFERENCES baseMember (baseMember_id) ON DELETE CASCADE" +
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
                "DROP TABLE IF EXISTS `sampleParcel`",
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
            this.connection.query("INSERT INTO `sampleParcel` (" +
                "sampleParcel_reference, sampleParcel_deliveryService, sampleParcel_testSampleId," +
                "sampleParcel_triggererId, sampleParcel_date, sampleParcel_file)" +
                " VALUES (?, ?, ?, ?, ?, ?)", [
                entity.reference, entity.deliveryService, entity.testSampleId, entity.triggererId, entity.date, entity.file
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
            this.connection.query("SELECT sampleParcel_id, sampleParcel_reference, sampleParcel_deliveryService," +
                "sampleParcel_testSampleId, sampleParcel_triggererId, sampleParcel_date FROM `sampleParcel`", (err, res)=>{
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

}
module.exports = SampleParcelDAO
