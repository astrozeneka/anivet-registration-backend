const BaseDAO = require("./BaseDAO");
const Address = require("../model/Address");

class AddressDAO extends BaseDAO {
    static instance = null;
    static getInstance(){
        if(this.instance == null) {
            this.instance = new AddressDAO()
        }
        return this.instance
    }
    static tearDown(){
        this.instance = null;
    }

    fromResultSet(r){
        let o = new Address()

        o.id = r.address_id
        o.address1 = r.address_address1
        o.country = r.address_country
        o.changwat = r.address_changwat
        o.amphoe = r.address_amphoe
        o.tambon = r.address_tambon
        o.postcode = r.address_postcode

        o.ownerId = r.address_ownerId
        o.breederId = r.address_breederId
        o.vetId = r.address_breederId

        return o
    }

    async buildTable(){
        return new Promise((resolve, reject)=>{
            let o = this.connection.query("" +
                "CREATE TABLE `address` (" +
                "   address_id INT(6) UNSIGNED AUTO_INCREMENT PRIMARY KEY," +
                "   address_address1 VARCHAR(255)," +
                "   address_country VARCHAR(255)," +
                "   address_changwat VARCHAR(255)," +
                "   address_amphoe VARCHAR(255)," +
                "   address_tambon VARCHAR(255)," +
                "   address_postcode VARCHAR(255)," +
                "" +
                "   address_ownerId INT(6) UNSIGNED," +
                "   address_breederId INT(6) UNSIGNED," +
                "   address_vetId INT(6) UNSIGNED," +
                "" +
                "   address_baseMemberId INT(6) UNSIGNED," +
                "   CONSTRAINT `fk_baseMemberId` FOREIGN KEY (address_baseMemberId) REFERENCES baseMember (baseMember_id) ON DELETE CASCADE" +
                //"   CONSTRAINT `fk_ownerId` FOREIGN KEY (address_ownerId) REFERENCES owner (owner_id) ON DELETE CASCADE," +
                //"   CONSTRAINT `fk_breederId` FOREIGN KEY (address_breederId) REFERENCES breeder (breeder_id) ON DELETE CASCADE" +
                "" +
                "" + // If it is address of a owner
                ") " +
                "ENGINE = InnoDB CHARSET=utf8 COLLATE utf8_general_ci;",
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
                "DROP TABLE IF EXISTS `address`",
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
            this.connection.query("INSERT INTO `address` (" +
                "address_address1, address_country, address_changwat, address_amphoe, address_tambon, address_postcode," +
                "address_ownerId, address_breederId, address_vetId, address_baseMemberId)" +
                " VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)", [
                entity.address1, entity.country, entity.changwat, entity.amphoe, entity.tambon, entity.postcode,
                entity.ownerId, entity.breederId, entity.vetId, entity.baseMemberId
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
            this.connection.query("SELECT * FROM `address`", (err, res)=>{
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
            this.connection.query("SELECT * FROM `address` WHERE address_id=?", [id], (err, res)=>{
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
                "UPDATE `address` SET" +
                "   address_address1=?," +
                "   address_country=?," +
                "   address_changwat=?," +
                "   address_amphoe=?," +
                "   address_tambon=?," +
                "   address_postcode=?," +
                "   address_ownerId=?," +
                "   address_breederId=?," +
                "   address_vetId=?" +
                " WHERE address_id=?",
                [entity.address1, entity.country, entity.changwat, entity.amphoe, entity.tambon, entity.postcode,
                entity.ownerId, entity.breederId, entity.vetId, entity.id],
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
                "DELETE FROM `address` WHERE address_id=?", [entity.id],
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

module.exports = AddressDAO
