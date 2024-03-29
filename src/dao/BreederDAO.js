const BaseMemberDAO = require("./BaseMemberDAO");
const Breeder = require("../model/Breeder");
const AddressDAO = require("./AddressDAO");
const BreedDAO = require("./BreedDAO");


class BreederDAO extends BaseMemberDAO{
    static instance = null;
    static getInstance(){
        if(this.instance == null) {
            this.instance = new BreederDAO()
        }
        return this.instance
    }
    static tearDown(){
        this.instance = null;
    }

    async buildTable(){

        await (()=>{
            new Promise((resolve, reject)=>{
                let o = this.connection.query("" +
                    "CREATE VIEW breeder AS" +
                    "   SELECT * FROM baseMember" +
                    "   WHERE baseMember_type = 'breeder'",
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
        await (()=>{
            new Promise((resolve, reject)=>{
                let o = this.connection.query("" +
                    "CREATE TABLE `assoc_breeder_breed` (" +
                    "   abb_breederId INT(6) UNSIGNED," +
                    "   abb_breedId INT(6) UNSIGNED," +
                    "" +
                    "   CONSTRAINT `fk_abb_breeder` FOREIGN KEY (abb_breederId) REFERENCES baseMember (baseMember_id) ON DELETE CASCADE," +
                    "   CONSTRAINT `fk_abb_breed` FOREIGN KEY (abb_breedId) REFERENCES breed (breed_id) ON DELETE CASCADE" +
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
        await (()=>{
            return new Promise((resolve, reject)=>{
                let o = this.connection.query("" +
                    "DROP TABLE IF EXISTS `assoc_breeder_breed`;",
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
        await (()=>{
            return new Promise((resolve, reject)=>{
                let o = this.connection.query("" +
                    "DROP VIEW IF EXISTS `breeder`",
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

    async add(entity){
        /**
         * Insert the entity
         */
        await (()=>{
            return new Promise((resolve, reject)=>{
                this.connection.query("" +
                    "INSERT INTO baseMember (baseMember_username, baseMember_password, " +
                    "baseMember_subscribe, baseMember_name1, baseMember_name2, baseMember_phone, baseMember_email," +
                    "baseMember_type) VALUES (?, ?, ?, ?, ?, ?, ?, ?)",
                    [entity.username, entity.password, entity.subscribe, entity.name1, entity.name2, entity.phone, entity.email, 'breeder'],
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

        /**
         * Insert address
         * Example of one-to-one relationship between class
         */
        //entity.address.breederId = entity.id;
        entity.address.baseMemberId = entity.id;
        await AddressDAO.getInstance().add(entity.address)

        /**
         * Insert breeds
         */
        for(let breed of entity.breeds){
            await BreedDAO.getInstance().add(breed)
        }


        /**
         * Insert association with breeds
         */
        for(let breed of entity.breeds){
            console.log()
            await (()=>{
                return new Promise((resolve, reject)=>{
                    this.connection.query("" +
                        "INSERT INTO `assoc_breeder_breed` (abb_breederId, abb_breedId) VALUES (?, ?)",
                        [entity.id, breed.id],
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
    }

    async getAll(){
        let output = await super.getAllByType('breeder')
        return output
    }

    async getById(id){
        return new Promise((resolve, reject)=>{
            this.connection.query("SELECT * FROM `breeder` INNER JOIN `address` ON address_baseMemberId = baseMember_id LEFT JOIN `validationNote` ON validationNote_id = baseMember_validationNoteId; WHERE baseMember_id = ?",
                [id], async (err, res) => {
                if (err) {
                    throw err;
                    reject(err)
                }

                if(res.length == 0) resolve(null)
                let breeder = this.fromResultSet(res[0])
                breeder.breeds = await BreedDAO.getInstance().getAllByBreeder(breeder.id);
                resolve(breeder);
            })
        })
    }

    async update(entity){

        /**
         * Update the main table
         */
        await(()=>{
            return new Promise((resolve, reject)=>{
                this.connection.query("" +
                    "UPDATE `breeder` SET" +
                    "   baseMember_username=?," +
                    "   baseMember_password=?," +
                    "   baseMember_subscribe=?," +
                    "   baseMember_name1=?," +
                    "   baseMember_name2=?," +
                    "   baseMember_phone=?," +
                    "   baseMember_email=?," +
                    "   baseMember_validationNoteId=?" +
                    " WHERE baseMember_id=?",
                    [entity.username, entity.password, entity.subscribe, entity.name1, entity.name2, entity.phone, entity.email,
                        entity.validationNoteId, entity.id],
                    function(err, res){
                        if(err){
                            throw err;
                            reject(err)
                        }
                        resolve(res)
                    })
            })
        })()

        /**
         * Update address
         */
        await AddressDAO.getInstance().update(entity.address)

        /**
         * Update cool
         */
        for(let breed of entity.breeds)
            await BreedDAO.getInstance().update(breed)

    }

    async delete(entity){

        /**
         * Firstly, we should load data of the entity
         */
        entity = await this.getById(entity.id)

        /**
         * DELETE ENTITY
         */
        await (()=>new Promise((resolve, reject)=>{
            this.connection.query("" +
                "DELETE FROM `baseMember` WHERE baseMember_id=?", [entity.id],
                function(err, res){
                    if(err){
                        throw err;
                        reject(err)
                    }
                    resolve()
                })
        }))()

        /**
         * DELETE ASSOCIATION
         */
        await (()=>new Promise((resolve, reject)=>{
            this.connection.query("" +
                "DELETE FROM `assoc_breeder_breed` WHERE abb_breederId=?", [entity.id],
                function(err, res){
                    if(err){
                        throw err;
                        reject(err)
                    }
                    resolve()
                })
        }))()
    }



    async count(){
        return new Promise((resolve, reject)=>{
            this.connection.query("SELECT COUNT(*) FROM `breeder`", (err, res)=>{
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

module.exports = BreederDAO
