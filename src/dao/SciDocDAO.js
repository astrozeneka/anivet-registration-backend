const BaseDAO = require("./BaseDAO");
const SciDoc = require("../model/SciDoc");


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

    fromResultSet(r){
        let o = new SciDoc()
        o.id = r.sciDoc_id
        o.reference = r.sciDoc_reference
        o.type = r.sciDoc_type
        o.testSampleId = r.sciDoc_testSampleId
        o.triggererId = r.sciDoc_triggererId
        o.date = r.sciDoc_date
        o.file = r.sciDoc_file
        return o
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

    async add(entity){
        return new Promise((resolve, reject)=>{
            this.connection.query("INSERT INTO `sciDoc` (" +
                "sciDoc_reference, sciDoc_type, sciDoc_testSampleId, sciDoc_triggererId, sciDoc_file, sciDoc_date)" +
                " VALUES (?, ?, ?, ?, ?, ?)", [
                entity.reference, entity.type, entity.testSampleId, entity.triggererId, entity.file, entity.date
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
            this.connection.query("SELECT sciDoc_id, sciDoc_reference, sciDoc_type, sciDoc_testSampleId, sciDoc_triggererId," +
                "sciDoc_date FROM `sciDoc`", (err, res)=>{
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
module.exports = SciDocDAO
