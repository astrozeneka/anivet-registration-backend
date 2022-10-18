const BaseCrudDAO = require("./BaseCrudDAO");
const sqlExecute = require("../../utils/sqlExecute");
const Message = require("../../model/Message");
const sqlQueryOne = require("../../utils/sqlQueryOne");
const BaseMemberDAO = require("./BaseMemberDAO");

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

    name = "message"

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
        await sqlExecute("" +
            "CREATE VIEW `message_registration` AS " +
            "SELECT message.*,\n" +
            "\t  sender.baseMember_id as sender_id," +
            "    sender.baseMember_username as sender_username,\n" +
            "    sender.baseMember_website as sender_website,\n" +
            "    sender.baseMember_subscribe as sender_subscribe,\n" +
            "    sender.baseMember_name1 as sender_name1,\n" +
            "    sender.baseMember_name2 as sender_name2,\n" +
            "    sender.baseMember_phone as sender_phone,\n" +
            "    sender.baseMember_email as sender_email,\n" +
            "    sender.baseMember_corp as sender_corp,\n" +
            "    sender.baseMember_type as sender_type," +
            "    receiver.baseMember_id as receiver_id,\n" +
            "    receiver.baseMember_username as receiver_username,\n" +
            "    receiver.baseMember_website as receiver_website,\n" +
            "    receiver.baseMember_subscribe as receiver_subscribe,\n" +
            "    receiver.baseMember_name1 as receiver_name1,\n" +
            "    receiver.baseMember_name2 as receiver_name2,\n" +
            "    receiver.baseMember_phone as receiver_phone,\n" +
            "    receiver.baseMember_email as receiver_email,\n" +
            "    receiver.baseMember_corp as receiver_corp,\n" +
            "    receiver.baseMember_type as receiver_type\n" +
            "FROM message\n" +
            "\tLEFT JOIN baseMember sender ON sender.baseMember_id=message_senderId\n" +
            "    LEFT JOIN baseMember receiver ON receiver.baseMember_id=message_receiverId\n" +
            "WHERE `message_tags` LIKE '%REGISTRATION%'")
    }

    async destroyTable(){
        // Views
        await sqlExecute("DROP VIEW IF EXISTS `message_registration`")
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
        },
        "registration": (r)=>{
            let o = MessageDAO.getInstance().sql_to_model[""](r)
            let rp1 = {}, rp2 = {}
            if(r.message_receiverId != null) {
                for (const key in r)
                    if (key.includes("receiver"))
                        rp1[key.replace("receiver", "baseMember")] = r[key]
                o.receiver = BaseMemberDAO.getInstance().sql_to_model[""](rp1)
            }
            if(r.message_senderId != null) {
                for (const key in r)
                    if (key.includes("sender"))
                        rp2[key.replace("receiver", "baseMember")] = r[key]
                o.sender = BaseMemberDAO.getInstance().sql_to_model[""](rp2)
            }
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
        },
        "registration": (m)=>{
            let o = {
                ...MessageDAO.getInstance().model_to_raw[""](m),
                sender: !m.sender?null:BaseMemberDAO.getInstance().model_to_raw[""](m.sender),
                receiver: !m.receiver?null:BaseMemberDAO.getInstance().model_to_raw[""](m.receiver)
            }
            return o
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
