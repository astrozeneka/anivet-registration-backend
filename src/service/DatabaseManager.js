const mysql = require("mysql");


class DatabaseManager{
    static instance = null;
    static getInstance(){
        if(this.instance == null) {
            this.instance = new DatabaseManager()
        }
        return this.instance
    }
    #connection = null

    constructor(){
    }

    async init(){
        return new Promise(((resolve, reject)=>{
            this.#connection = mysql.createPool({
                host: 'us-cdbr-east-06.cleardb.net',
                user: 'b0d4addb6803a3',
                password: '2dc05f71',
                database: "heroku_5cd29d26d91768f"
            });
            this.#connection.connect(function(err){
                if(err){
                    reject(err)
                }
                resolve()
            })
        }))
    }

    get connection() {
        return this.#connection;
    }
}

module.exports = DatabaseManager