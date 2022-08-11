
const BaseMemberDAO = require("./BaseMemberDAO")
const Breed = require("../model/Breed")
const BaseDAO = require("./BaseDAO");

class BreedDAO extends BaseDAO{
    static instance = null;
    static getInstance(){
        if(this.instance == null) {
            this.instance = new BreedDAO()
        }
        return this.instance
    }
    static tearDown(){
        this.instance = null;
    }

    fromResultSet(r){
        let o = new Breed()

        o.id = r.breed_id
        o.type = r.breed_type
        o.name = r.breed_name

        return o
    }

    async buildTable(){
        return new Promise((resolve, reject)=>{
            let o = this.connection.query("" +
                "CREATE TABLE `breed` (" +
                "   breed_id INT(6) UNSIGNED AUTO_INCREMENT PRIMARY KEY," +
                "   breed_type VARCHAR(255)," +
                "   breed_name VARCHAR(255)" +
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
                "DROP TABLE IF EXISTS `breed`",
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
        // TODO: Apply the same algorithm for all entity
        if(entity.id != null)
            return entity;

        return new Promise((resolve, reject)=>{
            this.connection.query("INSERT INTO `breed` (breed_type, breed_name) VALUES (?, ?)", [
                entity.type, entity.name
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
            this.connection.query("SELECT * FROM `breed`", (err, res)=>{
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
            this.connection.query("SELECT * FROM `breed` WHERE breed_id=?", [id], (err, res)=>{
                if(err){
                    throw err;
                    reject(err)
                }
                if(res.length == 0) resolve(null)
                resolve(this.fromResultSet(res[0]))
            })
        })
    }

    async getAllByBreeder(breederId){
        /**
         * Here the association table will be used
         */
        return new Promise((resolve, reject)=>{
            this.connection.query("SELECT * FROM `breed` INNER JOIN `assoc_breeder_breed` ON abb_breedId = breed_id WHERE abb_breederId = ?", [breederId], (err, res)=>{
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
        return new Promise((resolve, reject)=>{
            this.connection.query("" +
                "UPDATE `breed` SET" +
                "   breed_type=?," +
                "   breed_name=?" +
                " WHERE breed_id=?",
                [entity.type, entity.name, entity.id],
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
                "DELETE FROM `breed` WHERE breed_id=?", [entity.id],
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

module.exports = BreedDAO
