const BaseDAO = require("./BaseDAO");
const TestSampleDAO = require("./TestSampleDAO");
const TestOrder = require("../model/TestOrder");
const TestOrderWithSamples = require("../model/TestOrderWithSamples");

class TestOrderDAO extends BaseDAO {
    static instance = null;
    static getInstance(){
        if(this.instance == null) {
            this.instance = new TestOrderDAO()
        }
        return this.instance
    }
    static tearDown(){
        this.instance = null;
    }

    fromResultSet(r){
        let o = new TestOrderWithSamples();

        o.id = r.testOrder_id;
        o.name1 = r.testOrder_name1;
        o.name2 = r.testOrder_name2;
        o.website = r.testOrder_website;
        o.email = r.testOrder_email;

        return o
    }

    async buildTable(){
        return new Promise((resolve, reject)=>{
            let o = this.connection.query("" +
                "CREATE TABLE `testOrder` (" +
                "   testOrder_id INT(6) UNSIGNED AUTO_INCREMENT PRIMARY KEY," +
                "   testOrder_name1 VARCHAR(255)," +
                "   testOrder_name2 VARCHAR(255)," +
                "   testOrder_website VARCHAR(255)," +
                "   testOrder_email VARCHAR(255)" +
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
                "DROP TABLE IF EXISTS `testOrder`",
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
        /**
         * FIRSTLY CREATE TEST_ORDER
         */
        await (()=>{
            return new Promise((resolve, reject)=>{
                this.connection.query("" +
                    "INSERT INTO `testOrder` (testOrder_name1, testOrder_name2, testOrder_website, testOrder_email) VALUES (?, ?, ?, ?)",
                    [entity.name1, entity.name2, entity.website, entity.email],
                    function(err, res){
                        if(err){
                            reject(err)
                            throw(err)
                        }
                        entity.id = res.insertId
                        resolve(res)
                    }
                )
            })
        })()

        for (const sample of entity.samples) {
            sample.testOrderId = entity.id
            await TestSampleDAO.getInstance().add(sample)
        }

        return entity
    }

    async getAll(){
        /**
         * SELECT ALL TEST ORDERS
         */
        let orders = await (()=>{
            return new Promise((resolve, reject)=>{
                this.connection.query("SELECT * FROM `testOrder`", (err, res)=>{
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
        })()

        /**
         * SELECT
         */
        for(const order of orders){
            order.samples = await TestSampleDAO.getInstance().getAllByTestOrderId(order.id)
        }

        return orders
    }

    async getById(id){
        let output = await (()=>{
            return new Promise((resolve, reject)=>{
                this.connection.query("SELECT * FROM `testOrder` WHERE testOrder_id=?", [id], (err, res)=>{
                    if(err){
                        throw err;
                        reject(err)
                    }
                    if(res.length == 0) resolve(null)
                    resolve(this.fromResultSet(res[0]))
                })
            })
        })()

        output.samples = await TestSampleDAO.getInstance().getAllByTestOrderId(output.id)
        return output
    }

    async update(entity){
        await(()=>{
            return new Promise((resolve, reject)=>{
                this.connection.query("" +
                    "UPDATE `testOrder` SET" +
                    "   testOrder_name1=?," +
                    "   testOrder_name2=?," +
                    "   testOrder_website=?," +
                    "   testOrder_email=?" +
                    " WHERE testOrder_id=?",
                    [entity.name1, entity.name2, entity.website, entity.email, entity.id],
                    function(err, res){
                        if(err){
                            throw err;
                            reject(err)
                        }
                        resolve(res)
                    })
            })
        })()

        for(const sample of entity.samples){
            sample.testOrderId = entity.id
            let _r = await TestSampleDAO.getInstance().getById(sample.id)
            if(_r == null){
                await TestSampleDAO.getInstance().add(sample)
            }else{
                await TestSampleDAO.getInstance().update(sample)
            }
        }
    }

    async delete(entity){
        return new Promise((resolve, reject)=>{
            this.connection.query("" +
                "DELETE FROM `testOrder` WHERE testOrder_id=?", [entity.id],
                function(err, res){
                    if(err){
                        throw err;
                        reject(err)
                    }
                    resolve()
                })
        })
    }

    async count(){
        return new Promise((resolve, reject)=>{
            this.connection.query("SELECT COUNT(*) FROM `testOrder`", (err, res)=>{
                if(err){
                    throw err;
                    reject(err)
                }
                if(res.length == 0) resolve(null)
                resolve(res[0]['COUNT(*)'])
            })
        })
    }
}

module.exports = TestOrderDAO
