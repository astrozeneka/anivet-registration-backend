
const BaseMemberDAO = require("./BaseMemberDAO")
const Owner = require("../model/Owner");
const AddressDAO = require("./AddressDAO");

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

        o.id = r.baseMember_id
        o.username = r.baseMember_username
        o.password = r.baseMember_password
        o.website = r.baseMember_website
        o.subscribe = r.baseMember_subscribe
        o.name1 = r.baseMember_name1
        o.name2 = r.baseMember_name2
        o.phone = r.baseMember_phone
        o.email = r.baseMember_phone


        // Very important thing for the methodology of DAO using relationship between tables
        o.address = AddressDAO.getInstance().fromResultSet(r)

        return o
    }

    async buildTable(){
        /*
        return new Promise((resolve, reject)=>{
            let o = this.connection.query("" +
                "CREATE TABLE `owner` (" +
                "   owner_id INT(6) UNSIGNED AUTO_INCREMENT PRIMARY KEY," +
                "   owner_username VARCHAR(255)," +
                "   owner_password VARCHAR(255)," +
                "   owner_website VARCHAR(255)," +
                "   owner_subscribe VARCHAR(255)," +
                "   owner_name1 VARCHAR(255)," +
                "   owner_name2 VARCHAR(255)," +
                "   owner_phone VARCHAR(255)," +
                "   owner_email VARCHAR(255)" +
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

         */
        await (()=>{
            new Promise((resolve, reject)=>{
                let o = this.connection.query("" +
                    "CREATE VIEW owner AS" +
                    "   SELECT * FROM baseMember" +
                    "   WHERE baseMember_type = 'owner'",
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
                "DROP VIEW IF EXISTS `owner`",
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
            this.connection.query(/*"INSERT INTO `owner` (owner_username, owner_password, owner_website, owner_subscribe," +
                "owner_name1, owner_name2, owner_phone, owner_email) VALUES (?, ?, ?, ?, ?, ?, ?, ?)",*/
                "INSERT INTO `baseMember` (baseMember_username, baseMember_password, baseMember_website, baseMember_subscribe," +
                "baseMember_name1, baseMember_name2, baseMember_phone, baseMember_email, baseMember_type) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)", [
                entity.username, entity.password, entity.website, entity.subscribe,
                entity.name1, entity.name2, entity.phone, entity.email, 'owner'
            ], function (err, res){
                if(err){
                    throw err;
                    reject(err)
                }
                entity.id = res.insertId
                resolve(res)
            })
        }))()

        entity.address.baseMemberId = entity.id // Is also worked for One-to-many relationship
        await AddressDAO.getInstance().add(entity.address)
    }

    async getAll(){
        return new Promise((resolve, reject)=>{
            this.connection.query("SELECT * FROM `owner` INNER JOIN `address` ON address_baseMemberId=baseMember_id", (err, res)=>{
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
            this.connection.query("SELECT * FROM `owner` INNER JOIN `address` ON address_baseMemberId=baseMember_id WHERE baseMember_id=? AND baseMember_type='owner'", [id], (err, res)=>{
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
        await (()=>new Promise((resolve, reject)=>{
            this.connection.query("" +
                "UPDATE `baseMember` SET" +
                "   baseMember_username=?," +
                "   baseMember_password=?," +
                "   baseMember_website=?," +
                "   baseMember_subscribe=?," +
                "   baseMember_name1=?," +
                "   baseMember_name2=?," +
                "   baseMember_phone=?," +
                "   baseMember_email=?" +
                " WHERE baseMember_id=?",
            [entity.username, entity.password, entity.website, entity.subscribe,
            entity.name1, entity.name1, entity.phone, entity.email, entity.id],
            function(err, res){
                if(err){
                    throw err;
                    reject(err)
                }
                resolve(res)
            })
        }))()

        await AddressDAO.getInstance().update(entity.address) // Also used for one-to-many relationships
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
}
module.exports = OwnerDAO
