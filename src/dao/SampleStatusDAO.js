const BaseDAO = require("./BaseDAO");
const SampleStatus = require("../model/SampleStatus");

class SampleStatusDAO extends BaseDAO{
    static instance = null;
    static getInstance(){
        if(this.instance == null) {
            this.instance = new SampleStatusDAO()
        }
        return this.instance
    }
    static tearDown(){
        this.instance = null;
    }

    fromResultSet(r){
        let o = new SampleStatus()

        o.id = r.sampleStatus_id
        o.step = r.sampleStatus_step
        o.label = r.sampleStatus_label
        o.trackingTypeId = r.trackingTypeId
        o.trackingTypeLabel = r.trackingTypeLabel

        return o
    }

    async buildTable(){
        return new Promise((resolve, reject)=>{
            let o = this.connection.query("" +
                "CREATE TABLE `sampleStatus` (" +
                "   sampleStatus_id INT(6) UNSIGNED AUTO_INCREMENT PRIMARY KEY," +
                "   sampleStatus_step INT(6) UNSIGNED," +
                "   sampleStatus_label VARCHAR(255)," +
                "   sampleStatus_trackingTypeId INT(6) UNSIGNED," +
                "" +
                "   CONSTRAINT `fk_trackingTypeId` FOREIGN KEY (sampleStatus_trackingTypeId) REFERENCES trackingType (trackingType_id) ON DELETE CASCADE" +
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
                "DROP TABLE IF EXISTS `sampleStatus`",
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
            this.connection.query("INSERT INTO `sampleStatus` (" +
                "sampleStatus_step, sampleStatus_label, sampleStatus_trackingTypeId)" +
                " VALUES (?, ?, ?)", [
                entity.step, entity.label, entity.trackingTypeId
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

    async getAllByTrackingId(trackingTypeId){
        return new Promise((resolve, reject)=>{
            this.connection.query("SELECT * FROM `sampleStatus`\n" +
                " INNER JOIN `trackingType` ON sampleStatus_trackingTypeId = trackingType_id" +
                " WHERE trackingType_id = ?", [trackingTypeId, ], (err, res)=>{
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
module.exports = SampleStatusDAO
