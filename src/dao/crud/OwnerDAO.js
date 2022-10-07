const sqlExecute = require("../../utils/sqlExecute");
const Breeder = require("../../model/Breeder");
const Owner = require("../../model/Owner");
const sqlQueryMultiple = require("../../utils/sqlQueryMultiple");
const AddressDAO = require("./AddressDAO");
const sqlQueryOne = require("../../utils/sqlQueryOne");


class OwnerDAO {
    static instance = null;
    static getInstance(){
        if(this.instance == null) {
            this.instance = new OwnerDAO()
        }
        return this.instance
    }
    static tearDown(){
        this.instance = null;
    }

    name = "owner"

    async buildTable(){
        await sqlExecute("" +
            "CREATE VIEW owner AS" +
            "   SELECT * FROM baseMember" +
            "   WHERE baseMember_type = 'owner'")

        /**
         * Views
         */
        await sqlExecute("" +
            "CREATE VIEW `owner_` AS" +
            "   SELECT * from owner")
        await sqlExecute("" +
            "CREATE VIEW owner_edit AS" +
            "   SELECT * FROM `owner` LEFT JOIN `address` ON address_baseMemberId=baseMember_id")
    }

    async destroyTable(){
        // Views
        await sqlExecute("DROP VIEW IF EXISTS `owner_edit`")
        await sqlExecute("DROP VIEW IF EXISTS `owner_`")

        await sqlExecute("DROP VIEW IF EXISTS `owner`")
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
        },
        "edit": (r)=>{
            let o = this.sql_to_model[""](r)
            let a = AddressDAO.getInstance().sql_to_model[""](r)
            o.address = a
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
        },
        "edit": (m)=>{
            return{
                ...this.model_to_raw[""](m),
                ...AddressDAO.getInstance().model_to_raw[""](m.address)
            }
        }
    }

    raw_to_model(raw){
        let o = new Owner()
        o.id = raw.id
        o.username = raw.username
        o.website = raw.website
        o.subscribe = raw.subscribe
        o.name1 = raw.name1
        o.name2 = raw.name2
        o.phone = raw.phone
        o.email = raw.email
        return o
    }

    /**
     *
     * @param {''} view
     * @returns {Promise<void>}
     */
    async getAll(view){
        if(view == undefined)
            view = "" // The default view
        let viewName = this.name + "_" + view // Il est préférable de le superclasser
        return await sqlQueryMultiple(`SELECT * FROM ${viewName}`, this.sql_to_model[view])
    }

    async getOne(view, id){
        if(view == undefined)
            view = "" // The default view
        let viewName = this.name + "_" + view
        return await sqlQueryOne(`SELECT * FROM ${viewName} WHERE baseMember_id=?`, [id], this.sql_to_model[view])
    }

    async add(m){
        let d = await sqlExecute(
            "INSERT INTO `baseMember` (baseMember_username, baseMember_password, baseMember_website, baseMember_subscribe," +
            "baseMember_name1, baseMember_name2, baseMember_phone, baseMember_email, baseMember_type) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)", [
                m.username, m.password, m.website, m.subscribe,
                m.name1, m.name2, m.phone, m.email, 'owner'
            ]
        )
        m.id = d.insertId
        return m
    }
}
module.exports = OwnerDAO
