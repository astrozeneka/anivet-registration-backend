const BaseUserDAO = require("./BaseUserDAO");
const BaseMember = require("../model/BaseMember");
class BaseMemberDAO extends BaseUserDAO {
    static instance = null;
    static getInstance(){
        if(this.instance == null) {
            this.instance = new BaseMemberDAO()
        }
        return this.instance
    }
    static tearDown(){
        this.instance = null;
    }

    // FromResultSet
    // this method should be ovewritten by
    // child classes

    async buildTable(){
        await (()=>{
            new Promise((resolve, reject)=>{
                let o = this.connection.query("" +
                    "CREATE TABLE `baseMember` (" +
                    "   baseMember_id INT(6) UNSIGNED AUTO_INCREMENT PRIMARY KEY," +
                    "   baseMember_username VARCHAR(255)," +
                    "   baseMember_password VARCHAR(255)," +
                    "   baseMember_subscribe BOOLEAN," +
                    "   baseMember_name1 VARCHAR(255)," +
                    "   baseMember_name2 VARCHAR(255)," +
                    "   baseMember_phone VARCHAR(255)," +
                    "   baseMember_email VARCHAR(255)," +
                    "   baseMember_type ENUM('admin','breeder')" +
                    "" +
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
        return new Promise((resolve, reject)=>{
            let o = this.connection.query("" +
                "DROP TABLE IF EXISTS `baseMember`",
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

}
module.exports = BaseMemberDAO
