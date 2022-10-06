const sqlExecute = require("../../utils/sqlExecute");
const Breeder = require("../../model/Breeder");
const Vet = require("../../model/Vet");
const sqlQueryMultiple = require("../../utils/sqlQueryMultiple");

class VetDAO {
    static instance = null;
    static getInstance(){
        if(this.instance == null) {
            this.instance = new VetDAO()
        }
        return this.instance
    }
    static tearDown(){
        this.instance = null;
    }

    name = "vet"

    async buildTable(){
        await sqlExecute("" +
            "CREATE VIEW vet AS" +
            "   SELECT * FROM baseMember" +
            "   WHERE baseMember_type = 'vet'")

        /**
         * Views
         */
        await sqlExecute("" +
            "CREATE VIEW `vet_` AS" +
            "   SELECT * from vet")
    }

    async destroyTable(){
        await sqlExecute("DROP VIEW IF EXISTS `vet`")

        // Views
        await sqlExecute("DROP VIEW IF EXISTS `vet_`")
    }

    sql_to_model={
        "": (r)=>{
            let o = new Vet()
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
module.exports = VetDAO
