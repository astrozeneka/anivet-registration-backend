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

    fromResultSet(r){
        let o = new Breeder()

        o.id = r.breeder_id
        o.username = r.breeder_username
        o.password = r.breeder_password
        o.website = r.breeder_website
        o.subscribe = r.breeder_subscribe
        o.name1 = r.breeder_name1
        o.name2 = r.breeder_name2
        o.phone = r.breeder_phone
        o.email = r.breeder_email

        // One to One
        o.address = AddressDAO.getInstance().fromResultSet(r)

        // Many to Many
        // As if fromResultSet has beed defined to be a synchronous function,
        o.breeds = []

        return o
    }

    async buildTable(){
        await (()=>{
            new Promise((resolve, reject)=>{
                let o = this.connection.query("" +
                    "CREATE TABLE `breeder` (" +
                    "   breeder_id INT(6) UNSIGNED AUTO_INCREMENT PRIMARY KEY," +
                    "   breeder_username VARCHAR(255)," +
                    "   breeder_password VARCHAR(255)," +
                    "   breeder_subscribe BOOLEAN," +
                    "   breeder_name1 VARCHAR(255)," +
                    "   breeder_name2 VARCHAR(255)," +
                    "   breeder_phone VARCHAR(255)," +
                    "   breeder_email VARCHAR(255)" +
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
        await (()=>{
            new Promise((resolve, reject)=>{
                let o = this.connection.query("" +
                    "CREATE TABLE `assoc_breeder_breed` (" +
                    "   abb_breederId INT(6) UNSIGNED," +
                    "   abb_breedId INT(6) UNSIGNED," +
                    "" +
                    "   CONSTRAINT `fk_abb_breeder` FOREIGN KEY (abb_breederId) REFERENCES breeder (breeder_id) ON DELETE CASCADE," +
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
                    "DROP TABLE IF EXISTS `breeder`",
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
                    "INSERT INTO `breeder` (breeder_name1, breeder_name2, breeder_phone, breeder_email, breeder_username," +
                    "breeder_password, breeder_subscribe) VALUES (?, ?, ?, ?, ?, ?, ?);",
                    [entity.name1, entity.name2, entity.phone, entity.email, entity.username, entity.password,
                    entity.subscribe],
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
        entity.address.breederId = entity.id;
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
        let breeders = await (()=>{
            return new Promise((resolve, reject)=>{
                this.connection.query("SELECT * FROM `breeder` INNER JOIN `address` ON address_breederId = breeder_id", async (err, res) => {
                    if (err) {
                        throw err;
                        reject(err)
                    }
                    let output = []
                    for (let rdp of res) {
                        let breeder = this.fromResultSet(rdp)
                        breeder.breeds = await BreedDAO.getInstance().getAllByBreeder(breeder.id)
                        output.push(breeder)
                    }
                    resolve(output)
                })
            })
        })()
        return breeders;
    }

    async getById(id){
        return new Promise((resolve, reject)=>{
            this.connection.query("SELECT * FROM `breeder` INNER JOIN `address` ON address_breederId = breeder_id WHERE breeder_id = ?",
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
                    "   breeder_username=?," +
                    "   breeder_password=?," +
                    "   breeder_subscribe=?," +
                    "   breeder_name1=?," +
                    "   breeder_name2=?," +
                    "   breeder_phone=?," +
                    "   breeder_email=?" +
                    " WHERE breeder_id=?",
                    [entity.username, entity.password, entity.subscribe, entity.name1, entity.name2, entity.phone, entity.email,
                    entity.id],
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
                "DELETE FROM `breeder` WHERE breeder_id=?", [entity.id],
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
}

module.exports = BreederDAO
