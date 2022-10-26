const BaseCrudDAO = require("./BaseCrudDAO");
const sqlExecute = require("../../utils/sqlExecute");
const File = require("../../model/File")

class FileDAO extends BaseCrudDAO {
    static instance = null;
    static getInstance(){
        if(this.instance == null) {
            this.instance = new FileDAO()
        }
        return this.instance
    }
    static tearDown(){
        this.instance = null;
    }

    name = "file"

    async buildTable(){
        await sqlExecute("" +
            "CREATE TABLE `file` (" +
            "   file_id INT(6) UNSIGNED AUTO_INCREMENT PRIMARY KEY," +
            "   file_type VARCHAR(255)," +
            "   file_name VARCHAR(255)," +
            "   file_content LONGBLOB" +
            ")")

        await sqlExecute("" + // Only summary
            "CREATE VIEW `file_` AS" +
            "   SELECT file_id, file_type, file_name FROM `file`")

        await sqlExecute("" + // Contents are included
            "CREATE VIEW `file_content` AS" +
            "   SELECT * FROM `file`")
    }

    async destroyTable(){
        await sqlExecute("DROP VIEW IF EXISTS `file_content`")
        await sqlExecute("DROP VIEW IF EXISTS `file_`")

        await sqlExecute("" +
            "DROP TABLE IF EXISTS `file`")
    }

    sql_to_model = {
        "": (r)=>{
            let o = new File()
            o.id = r.file_id
            o.type = r.file_type
            o.name = r.file_name
            return o
        },
        "content": (r)=>{
            let o = FileDAO.getInstance().sql_to_model[""](r)
            o.content = r.file_content
            return o
        }
    }

    model_to_raw={
        "": (m)=>{
            let o = {
                id: m.id,
                type: m.type,
                name: m.name
            }
            return o
        },
        "content": (m)=>{
            // A very specific portion of code
            // @deprecated
            //let _buffer = new Buffer(m.content, 'base64')
            if(!m.content) return null
            let buffer = new Buffer.from(m.content, 'base64')
            let o = {
                ...FileDAO.getInstance().model_to_raw[""](m),
                content: buffer.toString()
            }
            return o
        }
    }

    raw_to_model(raw){
        let o = new File()
        o.id = raw.id
        o.type = raw.type
        o.name = raw.name
        o.content = raw.content
        return o
    }

    async add(m){
        let d = await sqlExecute("" +
            "INSERT INTO `file` (" +
            "   file_type, file_name, file_content" +
            ") VALUES (? , ? , ?)",
            [m.type, m.name, m.content])
        m.id = d.insertId
        return m
    }

    async update(m){
        await sqlExecute("" +
            "UPDATE `file` SET" +
            "   file_type=?," +
            "   file_name=?," +
            "   file_content=?" +
            " WHERE file_id=?",
            [m.type, m.name, m.content, m.id])
    }

}
module.exports = FileDAO
