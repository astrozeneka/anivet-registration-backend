const BaseDAO = require("./BaseDAO");


class TrackingTypeDAO extends BaseDAO{
    static instance = null;
    static getInstance(){
        if(this.instance == null) {
            this.instance = new TrackingTypeDAO()
        }
        return this.instance
    }
    static tearDown(){
        this.instance = null;
    }

    async buildTable(){
        return new Promise((resolve, reject)=>{
            let o = this.connection.query("" +
                "CREATE TABLE `trackingType` (" +
                "   trackingType_id INT(6) UNSIGNED AUTO_INCREMENT PRIMARY KEY," +
                "   trackingType_label VARCHAR(255)" +
                ")" +
                "ENGINE = InnoDB CHARSET=utf8 COLLATE utf8_general_ci;",
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
                "DROP TABLE IF EXISTS `trackingType`",
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
module.exports = TrackingTypeDAO
