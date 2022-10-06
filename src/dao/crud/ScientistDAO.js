const sqlExecute = require("../../utils/sqlExecute");
const Breeder = require("../../model/Breeder");
const sqlQueryMultiple = require("../../utils/sqlQueryMultiple");

class ScientistDAO {
    static instance = null;
    static getInstance(){
        if(this.instance == null) {
            this.instance = new ScientistDAO()
        }
        return this.instance
    }
    static tearDown(){
        this.instance = null;
    }

    name = "scientist"

    async buildTable(){
        await sqlExecute("" +
            "CREATE VIEW scientist AS" +
            "   SELECT * FROM baseMember" +
            "   WHERE baseMember_type = 'scientist'")

        /**
         * Views
         */
        await sqlExecute("" +
            "CREATE VIEW `scientist_` AS" +
            "   SELECT * from scientist")
    }

    async destroyTable(){
        // Views
        await sqlExecute("" +
            "DROP VIEW IF EXISTS `scientist_`")

        await sqlExecute("" +
            "DROP VIEW IF EXISTS `scientist`")

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
        let viewName = this.name + "_" + view
        return await sqlQueryMultiple(`SELECT * FROM ${viewName}`, this.sql_to_model[view])
    }
}
module.exports = ScientistDAO
