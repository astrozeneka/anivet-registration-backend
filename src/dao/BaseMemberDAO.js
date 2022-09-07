const BaseUserDAO = require("./BaseUserDAO");
const BaseMember = require("../model/BaseMember");
const Vet = require("../model/Vet");
const Admin = require("../model/Admin");
const Owner = require("../model/Owner");
const Breeder = require("../model/Breeder");
class BaseMemberDAO extends BaseUserDAO {
    static instance = null;
    static getInstance(){
        if(this.instance == null) {
            this.instance = new BaseMemberDAO()
        }
        return this.instance
    }
    static tearDown(){
        this.instance = null;
    }

    fromResultSet(r){
        let dao = this.getTypeDAO(r.baseMember_type)
        return dao.fromResultSet(r)
    }

    getTypeDAO(type){
        if(type == "admin")
            return require("./AdminDAO").getInstance()
        if(type == "owner")
            return require("./OwnerDAO").getInstance()
        if(type == "breeder")
            return require("./BreederDAO").getInstance()
        if(type == "vet")
            return require("./VetDAO").getInstance()
        throw("Entity is an unknown type")
    }

    getEntityDAO(entity){
        if(entity instanceof Admin)
            return require("./AdminDAO").getInstance()
        if(entity instanceof Owner)
            return require("./OwnerDAO").getInstance()
        if(entity instanceof Breeder)
            return require("./BreederDAO").getInstance()
        if(entity instanceof Vet)
            return require("./VetDAO").getInstance()
        throw("Entity is an unknown class")
    }

    // FromResultSet
    // this method should be ovewritten by
    // child classes

    async buildTable(){
        await (()=>{
            new Promise((resolve, reject)=>{
                let o = this.connection.query("" +
                    "CREATE TABLE `baseMember` (" +
                    "   baseMember_id INT(6) UNSIGNED AUTO_INCREMENT PRIMARY KEY," +
                    "   baseMember_username VARCHAR(255)," +
                    "   baseMember_password VARCHAR(255)," +
                    "   baseMember_website VARCHAR(255)," +
                    "   baseMember_subscribe BOOLEAN," +
                    "   baseMember_name1 VARCHAR(255)," +
                    "   baseMember_name2 VARCHAR(255)," +
                    "   baseMember_phone VARCHAR(255)," +
                    "   baseMember_email VARCHAR(255)," +
                    "   baseMember_corp VARCHAR(255)," +
                    "   baseMember_type ENUM('admin','breeder','owner','vet')" +
                    "" +
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
        })()
    }

    async destroyTable(){
        return new Promise((resolve, reject)=>{
            let o = this.connection.query("" +
                "DROP TABLE IF EXISTS `baseMember`",
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

    async doesUsernameExists(username){
        return new Promise((resolve, reject)=>{
            this.connection.query("SELECT * FROM baseMember WHERE baseMember_username=?",
                [username,], async (err, res)=>{
                resolve(res.length > 0)
            })
        })
    }

    async add(entity){
        let dao = this.getEntityDAO(entity)
        await dao.add(entity)
    }

    async getAll(){
        return new Promise((resolve, reject)=>{
            this.connection.query("SELECT * FROM `baseMember` LEFT JOIN `address` ON address_baseMemberId=baseMember_id", (err, res)=>{
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
        let dao = this.getEntityDAO(entity)
        await dao.update(entity)
    }

    async getById(id){
        return new Promise((resolve, reject)=>{
            this.connection.query("SELECT * FROM `baseMember` LEFT JOIN `address` ON address_baseMemberId=baseMember_id WHERE baseMember_id=?", [id], (err, res)=>{
                if(err){
                    throw err;
                    reject(err)
                }
                if(res.length == 0) resolve(null)
                resolve(this.fromResultSet(res[0]))
            })
        })
    }

    async authenticate(type, username, password){
        return new Promise((resolve, reject)=>{
            this.connection.query("SELECT * FROM `baseMember` WHERE baseMember_username=? AND baseMember_password=? AND baseMember_type=?", [username, password, type], (err, res)=>{
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
module.exports = BaseMemberDAO

