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
            this.#connection = mysql.createConnection({
                host: 'localhost',
                user: 'root',
                password: '',
                database: "backend-registration"
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