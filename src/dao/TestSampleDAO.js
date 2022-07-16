const BaseDAO = require("./BaseDAO");
const TestSample = require("../model/TestSample");

class TestSampleDAO extends BaseDAO{
    static instance = null;
    static getInstance(){
        if(this.instance == null) {
            this.instance = new TestSampleDAO()
        }
        return this.instance
    }
    static tearDown(){
        this.instance = null;
    }

    fromResultSet(r){
        let o = new TestSample();

        o.id = r.testSample_id
        o.animal = r.testSample_animal
        o.type = r.testSample_type
        o.petId = r.testSample_petId
        o.petSpecie = r.testSample_petSpecie
        o.test = r.testSample_test
        o.sampleType = r.testSample_sampleType
        o.image = r.testSample_ipmage

        return o
    }

    async buildTable(){
        return new Promise((resolve, reject)=>{
            let o = this.connection.query("" +
                "CREATE TABLE `testSample` (" +
                "   testSample_id INT(6) UNSIGNED AUTO_INCREMENT PRIMARY KEY," +
                "   testSample_animal VARCHAR(255)," +
                "   testSample_type VARCHAR(255)," +
                "   testSample_petId int(6)," +
                "   testSample_petSpecie VARCHAR(255)," + // Combine with pet
                "   testSample_test VARCHAR(255)," +
                "   testSample_sampleType VARCHAR(255)," +
                "   testSample_image int(6)," +
                "   testSample_testOrderId int(6) UNSIGNED," +
                "   CONSTRAINT `fk_testOrderId` FOREIGN KEY (testSample_testOrderId) REFERENCES testOrder (testOrder_id)" +
                "       ON DELETE CASCADE" +
                ");",
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
                "DROP TABLE IF EXISTS `testSample`",
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

    async add(entity) {
        return new Promise((resolve, reject)=>{
            this.connection.query("INSERT INTO `testSample` (testSample_animal, testSample_type, testSample_petId, " +
                "testSample_petSpecie, testSample_test, testSample_sampleType, testSample_image, testSample_testOrderId) VALUES (?, ?, ?, ?, ?, ?, ?, ?)", [
                entity.animal, entity.type, entity.petId, entity.petSpecie, entity.test, entity.sampleType, entity.image, entity.testOrderId
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
            this.connection.query("SELECT * FROM `testSample`", (err, res)=>{
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
            this.connection.query("SELECT * FROM `testSample` WHERE testSample_id=?", [id], (err, res)=>{
                if(err){
                    throw err;
                    reject(err)
                }
                if(res.length == 0) resolve(null)
                else resolve(this.fromResultSet(res[0]))
            })
        })
    }

    async getAllByTestOrderId(testOrderId){
        return new Promise((resolve, reject)=>{
            this.connection.query("SELECT * FROM `testSample` WHERE testSample_testOrderId=?", [testOrderId], (err, res)=>{
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

    async update(entity){
        return new Promise((resolve, reject)=>{
            this.connection.query("" +
                "UPDATE `testSample` SET" +
                "   testSample_animal=?," +
                "   testSample_type=?," +
                "   testSample_petId=?," +
                "   testSample_petSpecie=?," +
                "   testSample_test=?," +
                "   testSample_sampleType=?," +
                "   testSample_image=?," +
                "   testSample_testOrderId=?" +
                " WHERE testSample_id=?",
                [entity.animal, entity.type, entity.petId, entity.petSpecie, entity.test, entity.sampleType, entity.image,
                entity.testOrderId, entity.id],
                function(err, res){
                    if(err){
                        throw err;
                        reject(err)
                    }
                    resolve(res)
                })
        })
    }

    async delete(entity){
        return new Promise((resolve, reject)=>{
            this.connection.query("" +
                "DELETE FROM `testSample` WHERE testSample_id=?", [entity.id],
                function(err, res){
                    if(err){
                        throw err;
                        reject(err)
                    }
                    resolve()
                })
        })
    }
}

module.exports = TestSampleDAO