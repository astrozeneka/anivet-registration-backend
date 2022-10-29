const BaseCrudDAO = require("./BaseCrudDAO");
const sqlExecute = require("../../utils/sqlExecute");
const sqlQueryMultiple = require("../../utils/sqlQueryMultiple");
const BaseMember = require("../../model/BaseMember");
const Address = require("../../model/Address");
const sqlQueryOne = require("../../utils/sqlQueryOne");

class BaseMemberDAO extends BaseCrudDAO{
    static instance = null;
    static getInstance(){
        if(this.instance == null) {
            this.instance = new BaseMemberDAO()
        }
        return this.instance
    }
    static tearDown(){
        this.instance = null;
    }

    name = "baseMember"

    async buildTable(){
        await sqlExecute("" +
            "CREATE TABLE `baseMember` (" +
            "   baseMember_id INT(6) UNSIGNED AUTO_INCREMENT PRIMARY KEY," +
            "   baseMember_username VARCHAR(255)," +
            "   baseMember_password VARCHAR(255)," +
            "   baseMember_website VARCHAR(255)," +
            "   baseMember_subscribe BOOLEAN," +
            "   baseMember_name1 VARCHAR(255)," +
            "   baseMember_name2 VARCHAR(255)," +
            "   baseMember_phone VARCHAR(255)," +
            "   baseMember_email VARCHAR(255)," +
            "   baseMember_corp VARCHAR(255)," +
            "   baseMember_type ENUM('admin','breeder','owner','vet', 'scientist')," +
            "   baseMember_validationNoteId int(6) UNSIGNED," +
            "   CONSTRAINT `fk_baseMember_validationNote` FOREIGN KEY (baseMember_validationNoteId) REFERENCES validationNote (validationNote_id) ON DELETE CASCADE" +
            "" +
            ");")

        // Views
        await sqlExecute("" +
            "CREATE VIEW `baseMember_` AS" +
            "   SELECT * from baseMember")
        await sqlExecute("" +
            "CREATE VIEW `baseMember_validation` AS" +
            "   SELECT * FROM `baseMember`" +
            "       LEFT JOIN `address` ON address_baseMemberId=baseMember_id" +
            "       LEFT JOIN `validationNote` ON validationNote_id=baseMember_validationNoteId" +
            "   WHERE baseMember_type IN ('owner', 'breeder', 'vet')" +
            "    ") // Scientist and Admin don't need to validate their registration
        await sqlExecute("" +
            "CREATE VIEW `baseMember_validation_details` AS" +
            "   SELECT * FROM `baseMember_validation`")

        // Constraint
        await sqlExecute("" +
            "ALTER TABLE `address` ADD CONSTRAINT `fk_baseMemberId` FOREIGN KEY (address_baseMemberId) REFERENCES baseMember (baseMember_id) ON DELETE CASCADE")
    }

    async destroyTable(){
        // Constraint
        await sqlExecute("ALTER TABLE `address` DROP FOREIGN KEY `fk_baseMemberId`")

        // Views
        await sqlExecute("DROP VIEW IF EXISTS `baseMember_validation_details`")
        await sqlExecute("DROP VIEW IF EXISTS  `baseMember_validation`")
        await sqlExecute("DROP VIEW IF EXISTS  `baseMember_`")

        await sqlExecute("DROP TABLE IF EXISTS `baseMember`")
    }

    sql_search_string= { // Should be inherited
        "": "LOWER(CONCAT(baseMember_username,' ',baseMember_email,' ',baseMember_name1,' ',baseMember_name2,' ',baseMember_phone))"
    }

    sql_to_model={
        "": (r, prefix='baseMember')=>{
            let o = new BaseMember() // TO RECHECK, should work
            o.type = r[`${prefix}_type`]
            o.id = r[`${prefix}_id`]
            o.username = r[`${prefix}_username`]
            o.password = r[`${prefix}_password`]
            o.website = r[`${prefix}_website`]
            o.subscribe = r[`${prefix}_subscribe`]
            o.name1 = r[`${prefix}_name1`]
            o.name2 = r[`${prefix}_name2`]
            o.phone = r[`${prefix}_phone`]
            o.email = r[`${prefix}_email`]
            /*
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
            */
            return o
        },
        "validation": (r)=>{ // Build model from SQL row
            let o = new BaseMember()
            o.id = r.baseMember_id
            o.name1 = r.baseMember_name1
            o.name2 = r.baseMember_name2
            o.email = r.baseMember_email
            // Add date, (samy principle as triggerId)
            o.validated = (r.validationNote_validated==true)
            return o
        },
        "validation_details": (r)=>{
            let o = new BaseMember()
            o.id = r.baseMember_id
            o.name1 = r.baseMember_name1
            o.name2 = r.baseMember_name2
            o.phone = r.baseMember_phone
            o.email = r.baseMember_email
            o.username = r.baseMember_username
            o.address = new Address()
            o.address.address1 = r.address_address1
            o.address.country = r.address_country
            o.address.changwat = r.address_changwat
            o.address.amphoe = r.address_amphoe
            o.address.tambon = r.address_tambon
            o.address.postcode = r.address_postcode
            o.validationNoteId = r.validationNote_id
            o.validationNoteMessage = r.validationNote_message
            o.validationNoteDate = r.validationNote_date
            o.validationNoteValidated = r.validationNote_validated
            o.validated = o.validationNoteValidated
            return o
        }
    }

    // ไม่มี raw_to_model
    // raw_to_model is defined in the subclasses

    model_to_raw={
        "": (m)=>{
            return {
                id: m.id,
                type: m.type,
                username: m.username,
                password: m.password,
                website: m.website,
                subscribe: m.subscribe,
                name1: m.name1,
                name2: m.name2,
                phone: m.phone,
                email: m.email
            }
        },
        "validation": (m)=>{ // To be sent via JSON
            return {
                id: m.id, // The most important property
                name1: m.name1,
                name2: m.name2,
                email: m.email,
                validated: m.validated
            }
        },
        "validation_details": (m)=>{
            return {
                id: m.id,
                name1: m.name1,
                name2: m.name2,
                phone: m.phone,
                email: m.email,
                username: m.username,
                address1: m.address.address1,
                country: m.address.country,
                changwat: m.address.changwat,
                amphoe: m.address.amphoe,
                tambon: m.address.tambon,
                postcode: m.address.postcode,
                validationNoteId: m.validationNoteId,
                validationNoteMessage: m.validationNoteMessage,
                validationNoteDate: m.validationNoteDate,
                validationNoteValidated: m.validated,
                validated: m.validated
            }
        }
    }

    // To be inherited (make testset first)
    async getAll(view, offset, limit, searchQuery){
        if(view == undefined)
            view = "" // The default view
        let viewName = this.name + "_" + view
        let suffix = (offset!=undefined&&limit!=undefined)?` LIMIT ${limit} OFFSET ${offset}`:``
        return await sqlQueryMultiple(`SELECT * FROM ${viewName} ${suffix}`, this.sql_to_model[view])
    }

    async getOne(view, id){
        if(view == undefined)
            view = "" // The default view
        let viewName = this.name + "_" + view
        return await sqlQueryOne(`SELECT * FROM ${viewName} WHERE baseMember_id=?`, [id], this.sql_to_model[view])
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
}
module.exports = BaseMemberDAO
