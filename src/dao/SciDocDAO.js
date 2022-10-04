const BaseDAO = require("./BaseDAO");


class SciDocDAO extends BaseDAO{
    static instance = null;
    static getInstance(){
        if(this.instance == null) {
            this.instance = new SciDocDAO()
        }
        return this.instance
    }
    static tearDown(){
        this.instance = null;
    }

    async buildTable(){
        return new Promise((resolve, reject)=>{
            let o = this.connection.query("" +
                "CREATE TABLE `sciDoc` (" +
                "   sciDoc_id INT(6) UNSIGNED AUTO_INCREMENT PRIMARY KEY," +
                "   sciDoc_reference VARCHAR(255)," +
                "   sciDoc_type VARCHAR(255)," +
                "   sciDoc_testSampleId INT(6) UNSIGNED," +
                "   sciDoc_triggererId INT(6) UNSIGNED," +
                "   sciDoc_date DATETIME," +
                "   sciDoc_file LONGBLOB," +
                "" +
                "   CONSTRAINT `fk_sciDoc_testSampleId` FOREIGN KEY (sciDoc_testSampleId) REFERENCES testSample (testSample_id) ON DELETE CASCADE," +
                "   CONSTRAINT `fk_sciDoc_triggererId` FOREIGN KEY (sciDoc_triggererId) REFERENCES baseMember (baseMember_id) ON DELETE CASCADE" +
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
                "DROP TABLE IF EXISTS `sciDoc`",
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
module.exports = SciDocDAO
