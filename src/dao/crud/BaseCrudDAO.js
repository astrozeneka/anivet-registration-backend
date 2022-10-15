const sqlQueryOne = require("../../utils/sqlQueryOne");
const sqlQueryMultiple = require("../../utils/sqlQueryMultiple");

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

    async getAll(view, offset, limit, searchQuery){
        if(view == undefined)
            view = "" // The default view
        let viewName = this.name + "_" + view
        let suffix = (offset!=undefined&&limit!=undefined)?` LIMIT ${limit} OFFSET ${offset}`:``
        return await sqlQueryMultiple(`SELECT * FROM ${viewName} ${suffix}`, this.sql_to_model[view])
    }

    async getOne(view, id){
        if(!this.name)
            console.error("DAO name should be specified")
        if(view == undefined)
            view = "" // The default view
        let viewName = this.name + "_" + view
        return await sqlQueryOne(`SELECT * FROM ${viewName} WHERE ${this.name}_id=?`, [id], this.sql_to_model[view])
    }
}
module.exports = BaseCrudDAO
