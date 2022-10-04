const BaseDAO = require("./BaseDAO");

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

}
module.exports = SampleParcelDAO
