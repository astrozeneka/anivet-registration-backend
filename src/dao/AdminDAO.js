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

        o.id = r.baseMember_id
        o.username = r.baseMember_username
        o.password = r.baseMember_password
        o.website = r.baseMember_website

        return o
    }

    async buildTable(){
        return new Promise((resolve, reject)=>{
            let o = this.connection.query("" +
                "CREATE VIEW admin AS" +
                "   SELECT * FROM baseMember" +
                "   WHERE baseMember_type = 'admin'",
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
                "DROP VIEW IF EXISTS `admin`",
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
            this.connection.query("INSERT INTO `baseMember` (baseMember_username, baseMember_password, baseMember_website, baseMember_type) " +
                "  VALUES (?, ?, ?, ?)", [entity.username, entity.password, entity.website, 'admin'],
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
            this.connection.query("SELECT * FROM `admin` WHERE baseMember_id=?", [id], (err, res)=>{
                if(err){
                    throw err;
                    reject(err)
                }
                if(res.length == 0) resolve(null)
                resolve(this.fromResultSet(res[0]))
            })
        })
    }

    async getByUsername(username){
        return new Promise((resolve, reject)=>{
            this.connection.query("SELECT * FROM `admin` WHERE baseMember_username=?", [username], (err, res)=>{
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
                "   baseMember_username=?," +
                "   baseMember_password=?,"+
                "   baseMember_website=?" +
                " WHERE baseMember_id=?",
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
                "DELETE FROM `baseMember` WHERE baseMember_id=?", [entity.id],
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
            this.connection.query("SELECT * FROM `admin` WHERE baseMember_username=? AND baseMember_password=?", [username, password], (err, res)=>{
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
