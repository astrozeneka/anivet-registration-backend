const BaseMemberDAO = require("./BaseMemberDAO");
const Scientist = require("../model/Scientist");
const AddressDAO = require("./AddressDAO");

class ScientistDAO extends BaseMemberDAO{
    static instance = null;
    static getInstance(){
        if(this.instance == null) {
            this.instance = new ScientistDAO()
        }
        return this.instance
    }
    static tearDown(){
        this.instance = null;
    }


    fromResultSet(r){
        let o = new Scientist()

        o.id = r.baseMember_id
        o.username = r.baseMember_username
        o.password = r.baseMember_password
        o.website = r.baseMember_website
        o.subscribe = r.baseMember_subscribe
        o.name1 = r.baseMember_name1
        o.name2 = r.baseMember_name2
        o.phone = r.baseMember_phone
        o.email = r.baseMember_email

        o.address = AddressDAO.getInstance().fromResultSet(r)
        return o
    }

    async buildTable(){
        await (()=>{
            new Promise((resolve, reject)=>{
                let o = this.connection.query("" +
                    "CREATE VIEW scientist AS" +
                    "   SELECT * FROM baseMember" +
                    "   WHERE baseMember_type = 'scientist'",
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
                "DROP VIEW IF EXISTS `scientist`",
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
        await (()=>new Promise((resolve, reject)=>{
            this.connection.query(
                "INSERT INTO `baseMember` (baseMember_username, baseMember_password, baseMember_website, baseMember_subscribe," +
                "baseMember_name1, baseMember_name2, baseMember_phone, baseMember_email, baseMember_type) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)", [
                    entity.username, entity.password, entity.website, entity.subscribe,
                    entity.name1, entity.name2, entity.phone, entity.email, 'scientist'
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
            this.connection.query("SELECT * FROM `scientist` INNER JOIN `address` ON address_baseMemberId=baseMember_id", (err, res)=>{
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
            this.connection.query("SELECT * FROM `scientist` INNER JOIN `address` ON address_baseMemberId=baseMember_id WHERE baseMember_id=? AND baseMember_type='vet'", [id], (err, res)=>{
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
                "   baseMember_email=?," +
                " WHERE baseMember_id=?",
                [entity.username, entity.password, entity.website, entity.subscribe,
                    entity.name1, entity.name2, entity.phone, entity.email, entity.id],
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

    async count(){
        return new Promise((resolve, reject)=>{
            this.connection.query("SELECT COUNT(*) FROM `scientist`", (err, res)=>{
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
module.exports = ScientistDAO
