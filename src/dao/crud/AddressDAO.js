const sqlExecute = require("../../utils/sqlExecute");
const Address = require("../../model/Address");
const sqlQueryOne = require("../../utils/sqlQueryOne");


class AddressDAO {
    static instance = null;
    static getInstance(){
        if(this.instance == null) {
            this.instance = new AddressDAO()
        }
        return this.instance
    }
    static tearDown(){
        this.instance = null;
    }

    name = "address"

    async buildTable(){
        await sqlExecute("" +
            "CREATE TABLE `address` (" +
            "   address_id INT(6) UNSIGNED AUTO_INCREMENT PRIMARY KEY," +
            "   address_address1 VARCHAR(255)," +
            "   address_country VARCHAR(255)," +
            "   address_changwat VARCHAR(255)," +
            "   address_amphoe VARCHAR(255)," +
            "   address_tambon VARCHAR(255)," +
            "   address_postcode VARCHAR(255)," +
            "" +
            "   address_ownerId INT(6) UNSIGNED," +
            "   address_breederId INT(6) UNSIGNED," +
            "   address_vetId INT(6) UNSIGNED," +
            "" +
            "   address_baseMemberId INT(6) UNSIGNED," +
            "   CONSTRAINT `fk_baseMemberId` FOREIGN KEY (address_baseMemberId) REFERENCES baseMember (baseMember_id) ON DELETE CASCADE" +
            ") " +
            "ENGINE = InnoDB CHARSET=utf8 COLLATE utf8_general_ci;")

        /**
         * Views
         */
        await sqlExecute("" +
            "CREATE VIEW `address_` AS " +
            "   SELECT * FROM address")
    }

    async destroyTable(){
        // Views
        await sqlExecute("DROP VIEW IF EXISTS `address_`")

        await sqlExecute("DROP TABLE IF EXISTS `address`")
    }

    sql_to_model={
        "": (r)=>{
            let o = new Address()
            o.id = r.address_id
            o.address1 = r.address_address1
            o.address1 = r.address_address1
            o.country = r.address_country
            o.changwat = r.address_changwat
            o.amphoe = r.address_amphoe
            o.tambon = r.address_tambon
            o.postcode = r.address_postcode
            return o
        }
    }

    model_to_raw={
        "": (m)=>{
            return {
                id: m.id,
                address1: m.address1,
                country: m.country,
                changwat: m.changwat,
                amphoe: m.amphoe,
                tambon: m.tambon,
                postcode: m.postcode
            }
        }
    }

    raw_to_model(raw){
        let o = new Address()
        o.id = raw.id
        o.address1 = raw.address1
        o.country = raw.country
        o.changwat = raw.changwat
        o.amphoe = raw.amphoe
        o.tambon = raw.tambon
        o.postcode = raw.postcode
        return o
    }

    async getOneByBaseMemberId(view, baseMemberId){
        let viewName = "address_" + view
        return await sqlQueryOne(`SELECT * FROM ${viewName} INNER JOIN baseMember ON baseMember_id = address_baseMemberId WHERE baseMember_id=?;`, [baseMemberId], this.sql_to_model[view])
    }

    async add(m){
        let d = await sqlExecute("" +
            "INSERT INTO `address` (" +
            "address_address1, address_country, address_changwat, address_amphoe, address_tambon, address_postcode," +
            "address_ownerId, address_breederId, address_vetId, address_baseMemberId)" +
            " VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)", [
            m.address1, m.country, m.changwat, m.amphoe, m.tambon, m.postcode,
            m.ownerId, m.breederId, m.vetId, m.baseMemberId
        ])
        m.id = d.insertId
        return m
    }

    async update(m){
        return await sqlExecute("" +
            "UPDATE `address` SET" +
            "   address_address1=?," +
            "   address_country=?," +
            "   address_changwat=?," +
            "   address_amphoe=?," +
            "   address_tambon=?," +
            "   address_postcode=?," +
            "   address_ownerId=?," +
            "   address_breederId=?," +
            "   address_vetId=?" +
            " WHERE address_id=?",
            [m.address1, m.country, m.changwat, m.amphoe, m.tambon, m.postcode,
                m.ownerId, m.breederId, m.vetId, m.id])
    }
}
module.exports = AddressDAO
