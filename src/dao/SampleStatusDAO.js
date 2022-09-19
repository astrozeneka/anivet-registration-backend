const BaseDAO = require("./BaseDAO");

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
}
module.exports = SampleStatusDAO
