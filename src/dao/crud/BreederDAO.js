const sqlExecute = require("../../utils/sqlExecute");
const sqlQueryMultiple = require("../../utils/sqlQueryMultiple");
const Breeder = require("../../model/Breeder");

class BreederDAO {
    static instance = null;
    static getInstance(){
        if(this.instance == null) {
            this.instance = new BreederDAO()
        }
        return this.instance
    }
    static tearDown(){
        this.instance = null;
    }

    async buildTable(){
        await sqlExecute("" +
            "CREATE VIEW breeder AS" +
            "   SELECT * FROM baseMember" +
            "   WHERE baseMember_type='breeder'")

        await sqlExecute("" +
            "CREATE TABLE `assoc_breeder_breed` (" +
            "   abb_breederId INT(6) UNSIGNED," +
            "   abb_breedId INT(6) UNSIGNED," +
            "" +
            "   CONSTRAINT `fk_abb_breeder` FOREIGN KEY (abb_breederId) REFERENCES baseMember (baseMember_id) ON DELETE CASCADE," +
            "   CONSTRAINT `fk_abb_breed` FOREIGN KEY (abb_breedId) REFERENCES breed (breed_id) ON DELETE CASCADE" +
            ");")

        /**
         * Views
         */
        await sqlExecute("DROP VIEW IF EXISTS `breeder_`")
        await sqlExecute("" +
            "CREATE VIEW `breeder_` AS" +
            "   SELECT * from breeder")
    }

    async destroyTable(){
        await sqlExecute("" +
            "DROP TABLE IF EXISTS `assoc_breeder_breed`;")

        await sqlExecute("" +
            "DROP VIEW IF EXISTS `breeder`")
    }

    sql_to_model={
        "": (r)=>{
            let o = new Breeder()
            o.type = r.baseMember_type
            o.id = r.baseMember_id
            o.username = r.baseMember_username
            o.password = r.baseMember_password
            o.website = r.baseMember_website
            o.subscribe = r.baseMember_subscribe
            o.name1 = r.baseMember_name1
            o.name2 = r.baseMember_name2
            o.phone = r.baseMember_phone
            o.email = r.baseMember_email
            return o
        }
    }

    model_to_raw={
        "": (m)=>{
            return {
                id: m.id,
                type: m.type,
                username: m.username,
                website: m.website,
                subscribe: m.subscribe,
                name1: m.name1,
                name2: m.name2,
                phone: m.phone,
                email: m.email
            }
        }
    }

    /**
     *
     * @param {''} view
     * @returns {Promise<void>}
     */
    async getAll(view){
        if(view == undefined)
            view = "" // The default view
        let viewName = "breeder_" + view
        return await sqlQueryMultiple(`SELECT * FROM ${viewName}`, this.sql_to_model[view])
    }
}
module.exports = BreederDAO
