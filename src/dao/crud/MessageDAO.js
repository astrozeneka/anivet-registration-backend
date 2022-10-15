const BaseCrudDAO = require("./BaseCrudDAO");
const sqlExecute = require("../../utils/sqlExecute");
const Message = require("../../model/Message");
const sqlQueryOne = require("../../utils/sqlQueryOne");

class MessageDAO extends BaseCrudDAO{
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

    async buildTable(){
        await sqlExecute("" +
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
            "ENGINE = InnoDB CHARSET=utf8 COLLATE utf8_general_ci;;")

        // View
        await sqlExecute("" +
            "CREATE VIEW `message_` AS" +
            "   SELECT * FROM message")
    }

    async destroyTable(){
        // Views
        await sqlExecute("DROP VIEW IF EXISTS `message_`")

        await sqlExecute("DROP TABLE IF EXISTS `message`")
    }

    sql_to_model={
        "": (r)=>{
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
    }

    model_to_raw={
        "": (m)=>{
            return {
                id: m.id,
                tags: m.tags,
                title: m.title,
                content: m.content,
                senderId: m.senderId,
                receiverId: m.receiverId,
                date: m.date,
                read: m.read
            }
        }
    }

    raw_to_mode(raw){
        let o = new Message()
        o.id = raw.id
        o.tags = raw.tags
        o.title = raw.title
        o.content = raw.content
        o.senderId = raw.senderId
        o.receiverId = raw.receiverId
        o.date = raw.date
        o.read = raw.read
        return o
    }

    async add(m){
        let date = ""
        if(m.date == undefined || m.date == null)
            date = null
        else
            date = m.date.toMysqlFormat()
        let d = await sqlExecute("" +
            "INSERT INTO `message` (" +
            "message_tags, message_title, message_content, message_senderId, message_receiverId, message_date, message_read)" +
            " VALUES (?, ?, ?, ?, ?, ?, ?)", [
            m.tags, m.title, m.content, m.senderId, m.receiverId, date, m.read
        ])
        m.id = d.insertId
        return m
    }

    async getOne(view, id){
        if(view == undefined)
            view = "" // The default view
        let viewName = this.name + "_" + view
        return await sqlQueryOne(`SELECT * FROM ${viewName} WHERE message_id=?`, [id], this.sql_to_model[view])
    }
}
module.exports = MessageDAO
