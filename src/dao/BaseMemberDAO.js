const BaseUserDAO = require("./BaseUserDAO");
const BaseMember = require("../model/BaseMember");
const Vet = require("../model/Vet");
const Admin = require("../model/Admin");
const Owner = require("../model/Owner");
const Breeder = require("../model/Breeder");
const Scientist = require("../model/Scientist");
const Address = require("../model/Address");
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

        let o = this.getTypeModel(r.baseMember_type)
        o.type = r.baseMember_type
        // Entity-owned properties
        o.id = r.baseMember_id
        o.username = r.baseMember_username
        o.password = r.baseMember_password
        o.website = r.baseMember_website
        o.subscribe = r.baseMember_subscribe
        o.name1 = r.baseMember_name1
        o.name2 = r.baseMember_name2
        o.phone = r.baseMember_phone
        o.email = r.baseMember_email

        // A subtle restructuration
        o.validationNoteId = r.baseMember_validationNoteId
        o.validationNoteValidated = r.validationNote_validated
        o.validationNoteMessage = r.validationNote_message
        o.validationNoteDate = r.validationNote_date

        // Only if the entity has address
        if(r.hasOwnProperty("address_id")){
            let ad = new Address()
            ad.id = r.address_id
            ad.address1 = r.address_address1
            ad.country = r.address_country
            ad.changwat = r.address_changwat
            ad.amphoe = r.address_amphoe
            ad.tambon = r.address_tambon
            ad.postcode = r.address_postcode
            o.address = ad
        }

        return o
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
        if(type == "scientist")
            return require("./ScientistDAO").getInstance()
        throw("Entity is an unknown type")
    }

    getTypeModel(type){
        if(type == "admin")
            return new (require("../model/Admin"))()
        if(type == "owner")
            return new (require("../model/Owner"))()
        if(type == "breeder")
            return new (require("../model/Breeder"))()
        if(type == "vet")
            return new (require('../model/Vet'))()
        if(type == "scientist")
            return new (require("../model/Scientist"))()
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
        if(entity instanceof Scientist)
            return require('./ScientistDAO').getInstance()
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
                    "   baseMember_type ENUM('admin','breeder','owner','vet', 'scientist')," +
                    "   baseMember_validationNoteId int(6) UNSIGNED," +
                    "   CONSTRAINT `fk_baseMember_validationNote` FOREIGN KEY (baseMember_validationNoteId) REFERENCES validationNote (validationNote_id) ON DELETE CASCADE" +
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
            this.connection.query("SELECT * FROM `baseMember` LEFT JOIN `address` ON address_baseMemberId=baseMember_id LEFT JOIN `validationNote` ON validationNote_id = baseMember_validationNoteId;", (err, res)=>{
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

    async getAllByType(type){
        return new Promise((resolve, reject)=>{
            this.connection.query("SELECT * FROM `baseMember` LEFT JOIN `address` ON address_baseMemberId=baseMember_id LEFT JOIN `validationNote` ON validationNote_id = baseMember_validationNoteId WHERE baseMember_type=?;", [type,], (err, res)=>{
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

    async delete(entity){
        let dao = this.getEntityDAO(entity)
        return await dao.delete(entity)
    }

    async getById(id){
        return new Promise((resolve, reject)=>{
            this.connection.query("SELECT * FROM `baseMember` LEFT JOIN `address` ON address_baseMemberId=baseMember_id LEFT JOIN `validationNote` ON validationNote_id = baseMember_validationNoteId WHERE baseMember_id=?", [id], (err, res)=>{
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

    async count(){
        return new Promise((resolve, reject)=>{
            this.connection.query("SELECT COUNT(*) FROM `baseMember`", (err, res)=>{
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
module.exports = BaseMemberDAO

