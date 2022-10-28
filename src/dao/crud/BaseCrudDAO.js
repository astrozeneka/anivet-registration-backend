const sqlQueryOne = require("../../utils/sqlQueryOne");
const sqlQueryMultiple = require("../../utils/sqlQueryMultiple");
const sqlExecute = require("../../utils/sqlExecute");

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

    async searchAll(view, offset, limit, searchQuery){
        if(view == undefined)
            view = "" // The default view
        let viewName = this.name + "_" + view
        let range = (offset!=undefined&&limit!=undefined)?` LIMIT ${limit} OFFSET ${offset}`:``


        // To recheck again, should be ok
        let searchString, sql, p0
        if(searchQuery.q instanceof Object){
            for (const key in searchQuery.q){
                searchString = this.sql_search_string[key]
                searchQuery.q = searchQuery.q[key]
                break
            }
            sql = `SELECT *, ${searchString} AS s FROM ${viewName} HAVING s=? ${range}`
            p0 = `${searchQuery.q}`
            if(searchQuery.q == null)
                sql = `SELECT *, ${searchString} AS s FROM ${viewName} HAVING s IS NULL ${range}`

        }else{
            searchString = this.sql_search_string[""]
            sql = `SELECT *, ${searchString} AS s FROM ${viewName} HAVING s LIKE ? ${range}`
            p0 = `%${searchQuery.q.toLowerCase()}%`
        }


        return await sqlQueryMultiple(sql, [p0], this.sql_to_model[view])
    }

    async getOne(view, id){
        if(!this.name)
            console.error("DAO name should be specified")
        if(view == undefined)
            view = "" // The default view
        let viewName = this.name + "_" + view
        return await sqlQueryOne(`SELECT * FROM ${viewName} WHERE ${this.name}_id=?`, [id], this.sql_to_model[view])
    }

    async delete(m){
        let d = await sqlExecute(`DELETE FROM ${this.name} WHERE ${this.name}_id=?`, [m.id])
        return d.affectedRows
    }
}
module.exports = BaseCrudDAO
