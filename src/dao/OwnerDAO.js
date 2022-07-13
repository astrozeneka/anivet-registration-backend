
const BaseMemberDAO = require("./BaseMemberDAO")
const Owner = require("../model/Owner");

class OwnerDAO extends BaseMemberDAO{
    static instance = null;
    static getInstance(){
        if(this.instance == null) {
            this.instance = new OwnerDAO()
        }
        return this.instance
    }
    static tearDown(){
        this.instance = null;
    }

    fromResultSet(r){
        let o = new Owner()

        o.id = r.owner_id
        o.username = r.owner_username
        o.password = r.owner_password
        o.website = r.owner_website
        o.subscribe = r.owner_subscribe

        return o
    }

    async buildTable(){
        return new Promise((resolve, reject)=>{
            let o = this.connection.query("" +
                "CREATE TABLE `owner` (" +
                "   owner_id INT(6) UNSIGNED AUTO_INCREMENT PRIMARY KEY," +
                "   owner_username VARCHAR(255)," +
                "   owner_password VARCHAR(255)," +
                "   owner_website VARCHAR(255)," +
                "   owner_subscribe VARCHAR(255)" +
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
                "DROP TABLE IF EXISTS `owner`",
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
            this.connection.query("INSERT INTO `owner` (owner_username, owner_password, owner_website, owner_subscribe) VALUES (?, ?, ?, ?)", [
                entity.username, entity.password, entity.website, entity.subscribe
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
            this.connection.query("SELECT * FROM `owner`", (err, res)=>{
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
            this.connection.query("SELECT * FROM `owner` WHERE owner_id=?", [id], (err, res)=>{
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
                "UPDATE `owner` SET" +
                "   owner_username=?," +
                "   owner_password=?," +
                "   owner_website=?," +
                "   owner_subscribe=?" +
                " WHERE owner_id=?",
            [entity.username, entity.password, entity.website, entity.subscribe, entity.id],
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
                "DELETE FROM `owner` WHERE owner_id=?", [entity.id],
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
module.exports = OwnerDAO