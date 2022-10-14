const sqlExecute = require("../../utils/sqlExecute");
const Vet = require("../../model/Vet");
const sqlQueryMultiple = require("../../utils/sqlQueryMultiple");
const AddressDAO = require("./AddressDAO");
const sqlQueryOne = require("../../utils/sqlQueryOne");
const BaseMemberDAO = require("./BaseMemberDAO");

class VetDAO extends BaseMemberDAO {
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
        await sqlExecute("" +
            "CREATE VIEW `vet_edit` AS" +
            "   SELECT * FROM `vet`  LEFT JOIN `address` ON address_baseMemberId=baseMember_id")
        await sqlExecute("" +
            "CREATE VIEW `vet_$search` AS" +
            "   SELECT *, CONCAT(baseMember_username,' ',baseMember_email,' ',baseMember_name1,' ',baseMember_name2,' ',baseMember_phone) AS s FROM `vet`"
        )
    }

    async destroyTable(){
        // Views
        await sqlExecute("DROP VIEW IF EXISTS `vet_$search`")
        await sqlExecute("DROP VIEW IF EXISTS `vet_edit`")
        await sqlExecute("DROP VIEW IF EXISTS `vet_`")

        await sqlExecute("DROP VIEW IF EXISTS `vet`")
    }

    sql_search_string={
        "": "LOWER(CONCAT(baseMember_username,' ',baseMember_email,' ',baseMember_name1,' ',baseMember_name2,' ',baseMember_phone))"
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
            return {
                ...this.model_to_raw[""](m),
                ...AddressDAO.getInstance().model_to_raw[""](m.address)
            }
        }
    }

    raw_to_model(raw){
        let o = new Vet()
        o.id = raw.id
        o.username = raw.username
        o.website = raw.website
        o.password = raw.password
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
    async getAll(view, offset, limit){
        if(view == undefined)
            view = "" // The default view
        let viewName = this.name + "_" + view
        let suffix = (offset!=undefined&&limit!=undefined)?` LIMIT ${limit} OFFSET ${offset}`:``
        return await sqlQueryMultiple(`SELECT * FROM ${viewName} ${suffix}`, this.sql_to_model[view])
    }

    async searchAll(view, offset, limit, searchQuery){
        if(view == undefined)
            view = "" // The default view
        let viewName = this.name + "_" + view // Il est préférable de le superclasser
        let range = (offset!=undefined&&limit!=undefined)?` LIMIT ${limit} OFFSET ${offset}`:``
        return await sqlQueryMultiple(`SELECT *, ${this.sql_search_string[""]} AS s FROM ${viewName} HAVING s LIKE ? ${range}`, [`%${searchQuery.q.toLowerCase()}%`], this.sql_to_model[view])
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
                m.name1, m.name2, m.phone, m.email, 'vet'
            ]
        )
        m.id = d.insertId
        return m
    }

    async update(m){
        await sqlExecute("" +
            "UPDATE `baseMember` SET" +
            "   baseMember_username=?," +
            "   baseMember_password=?," +
            "   baseMember_website=?," +
            "   baseMember_subscribe=?," +
            "   baseMember_name1=?," +
            "   baseMember_name2=?," +
            "   baseMember_phone=?," +
            "   baseMember_email=?," +
            "   baseMember_validationNoteId=?" +
            " WHERE baseMember_id=?",
            [m.username, m.password, m.website, m.subscribe, m.name1, m.name2, m.phone, m.email, m.validationNoteId, m.id]
        )
    }

    async delete(m){
        let d = await sqlExecute("DELETE FROM `baseMember` WHERE baseMember_id=?", [m.id])
        return d.affectedRows
    }
}
module.exports = VetDAO
