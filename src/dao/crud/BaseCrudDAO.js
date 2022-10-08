const sqlQueryOne = require("../../utils/sqlQueryOne");

class BaseCrudDAO {
    name = null

    sql_to_props(raw){
        return {
            totalCount: raw["COUNT(*)"]
        }
    }

    async getProps(){
        return await sqlQueryOne(`SELECT COUNT(*) FROM ${this.name}`, this.sql_to_props)
    }
}
module.exports = BaseCrudDAO
