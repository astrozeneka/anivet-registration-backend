const BaseBL = require("./BaseBL");
const resetDatabase = require("../utils/resetDatabase");
const AdminDAO = require("../dao/AdminDAO");
const Admin = require("../model/Admin");

/**
 * This class is used to install all tables of the database
 * Indeed, it will destroy the existant database and
 * will create an empty one
 *
 * Only the admin account will be created after the installation
 * By Default
 *
 * For generating the seed data, please refer to
 * SeedBL.js
 */
class InstallationBL extends BaseBL {
    static instance = null;
    static getInstance(){
        if(this.instance == null) {
            this.instance = new InstallationBL()
        }
        return this.instance
    }
    static tearDown(){
        this.instance = null;
    }

    constructor(){
        super();
    }

    /**
     * All DAO used for all businessLogicLayers will be instatiated
     * via this function
     * @returns {Promise<void>}
     */
    async installDB(){
        await resetDatabase()

        // Add the default admin user
        let admin = new Admin()
        admin.username = "admin"
        admin.password = "admin"
        admin.website = ""
        await AdminDAO.getInstance().add(admin)
    }
}
module.exports = InstallationBL
