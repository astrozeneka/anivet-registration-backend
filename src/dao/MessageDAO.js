const BaseDAO = require("./BaseDAO");
const Message = require("../model/Message");
require("../utils/date")

class MessageDAO extends BaseDAO{
    static instance = null;
    static getInstance(){
        if(this.instance == null) {
            this.instance = new MessageDAO()
        }
        return this.instance
    }
    static tearDown(){
        this.instance = null;
    }

    fromResultSet(r){
        let o = new Message()

        o.id = r.message_id
        o.tags = r.message_tags
        o.title = r.message_title
        o.content = r.message_content
        o.senderId = r.message_senderId
        o.receiverId = r.message_receiverId
        o.date = r.message_date
        o.read = r.message_read

        return o
    }

    async buildTable(){
        return new Promise((resolve, reject)=>{
            let o = this.connection.query("" +
                "CREATE TABLE `message` (" +
                "   message_id INT(6) UNSIGNED AUTO_INCREMENT PRIMARY KEY," +
                "   message_tags VARCHAR(255)," +
                "   message_title VARCHAR(255)," +
                "   message_content VARCHAR(255)," +
                "   message_senderId INT(6) UNSIGNED," +
                "   message_receiverId INT(6) UNSIGNED," +
                "   message_date DATETIME," +
                "   message_read BOOLEAN," +
                "" +
                "   CONSTRAINT `fk_senderId` FOREIGN KEY (message_senderId) REFERENCES baseMember (baseMember_id) ON DELETE CASCADE" +
                ")" +
                "ENGINE = InnoDB CHARSET=utf8 COLLATE utf8_general_ci;;",
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
                "DROP TABLE IF EXISTS `message`",
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
        let date = ""
        if(entity.date == undefined || entity.date == null)
            date = null
        else
            date = entity.date.toMysqlFormat()
        return new Promise((resolve, reject)=>{
            this.connection.query("INSERT INTO `message` (" +
                "message_tags, message_title, message_content, message_senderId, message_receiverId, message_date, message_read)" +
                " VALUES (?, ?, ?, ?, ?, ?, ?)", [
                entity.tags, entity.title, entity.content, entity.senderId, entity.receiverId, date, entity.read
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
            this.connection.query("SELECT * FROM `message`", (err, res)=>{
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
            this.connection.query("SELECT * FROM `message` WHERE message_id=? ORDER BY message_date ASC", [id], (err, res)=>{
                if(err){
                    throw err;
                    reject(err)
                }
                if(res.length == 0) resolve(null)
                resolve(this.fromResultSet(res[0]))
            })
        })
    }

    async getAllSentBy(sender){
        return new Promise((resolve, reject)=>{
            this.connection.query("SELECT * FROM `message` WHERE message_senderId=? ORDER BY message_date ASC", [sender], (err, res)=>{
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

    async getAllReceivedBy(receiver){
        return new Promise((resolve, reject)=>{
            this.connection.query("SELECT * FROM `message` WHERE message_receiverId=? ORDER BY message_date DESC;", [receiver],  (err, res)=>{
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
}
module.exports = MessageDAO
