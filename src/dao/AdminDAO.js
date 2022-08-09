const BaseMemberDAO = require("./BaseMemberDAO");
const Admin = require("../model/Admin");


class AdminDAO extends BaseMemberDAO{
    static instance = null;
    static getInstance(){
        if(this.instance == null) {
            this.instance = new AdminDAO()
        }
        return this.instance
    }
    static tearDown(){
        this.instance = null;
    }

    fromResultSet(r){
        let o = new Admin()

        o.id = r.admin_id
        o.username = r.admin_username
        o.password = r.admin_password
        o.website = r.admin_website

        return o
    }

    async buildTable(){
        return new Promise((resolve, reject)=>{
            let o = this.connection.query("" +
                "CREATE TABLE `admin` (" +
                "   admin_id INT(6) UNSIGNED AUTO_INCREMENT PRIMARY KEY," +
                "   admin_username VARCHAR(255)," +
                "   admin_password VARCHAR(255)," +
                "   admin_website VARCHAR(255)" +
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
                "DROP TABLE IF EXISTS `admin`",
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
        await (()=>new Promise((resolve, reject)=>{
            this.connection.query("INSERT INTO `admin` (admin_username, admin_password, admin_website) " +
                "  VALUES (?, ?, ?)", [entity.username, entity.password, entity.website],
                function (err, res){
                if(err){
                    throw err;
                    reject(err)
                }
                entity.id = res.insertId
                resolve(res)
            })
        }))()
    }

    async getAll(){
        return new Promise((resolve, reject)=>{
            this.connection.query("SELECT * FROM `admin`", (err, res)=>{
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
            this.connection.query("SELECT * FROM `admin` WHERE admin_id=?", [id], (err, res)=>{
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
                "UPDATE `admin` SET" +
                "   admin_username=?," +
                "   admin_password=?," +
                "   admin_website=?" +
                " WHERE admin_id=?",
                [entity.username, entity.password, entity.website, entity.id],
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
                "DELETE FROM `admin` WHERE admin_id=?", [entity.id],
                function(err, res){
                    if(err){
                        throw err;
                        reject(err)
                    }
                    resolve()
                })
        })
    }

    async authenticate(username, password){
        return new Promise((resolve, reject)=>{
            this.connection.query("SELECT * FROM `admin` WHERE admin_username=? AND admin_password=?", [username, password], (err, res)=>{
                if(err){
                    throw err;
                    reject(err)
                }
                if(res.length == 0) resolve(null)
                else resolve(this.fromResultSet(res[0]))
            })
        })
    }
}
module.exports = AdminDAO
