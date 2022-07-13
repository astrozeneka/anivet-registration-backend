const DatabaseManager = require("../service/DatabaseManager")


class BaseDAO {
    get connection(){
        return DatabaseManager.getInstance().connection
    }
}
module.exports = BaseDAO