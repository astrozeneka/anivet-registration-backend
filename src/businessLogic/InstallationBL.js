const BaseBL = require("./BaseBL");
const resetDatabase = require("../utils/resetDatabase");
const AdminDAO = require("../dao/AdminDAO");
const Admin = require("../model/Admin");
const TrackingType = require("../model/TrackingType");
const TrackingTypeDAO = require("../dao/TrackingTypeDAO");
const SampleStatus = require("../model/SampleStatus");
const SampleStatusDAO = require("../dao/SampleStatusDAO");
const DatabaseManager = require("../service/DatabaseManager");

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

    async initSampleState(){
        let ct = new TrackingType() // ID should be 1
        ct.label = "common"
        await TrackingTypeDAO.getInstance().add(ct)

        let s0 = new SampleStatus()
        s0.step = 0
        s0.label = "unregistered"
        s0.trackingTypeId = ct.id
        await SampleStatusDAO.getInstance().add(s0)

        let s1 = new SampleStatus()
        s1.step = 1
        s1.label = "registered"
        s1.trackingTypeId = ct.id
        await SampleStatusDAO.getInstance().add(s1)

        let s2 = new SampleStatus()
        s2.step = 2
        s2.label = "preparing"
        s2.trackingTypeId = ct.id
        await SampleStatusDAO.getInstance().add(s2)

        let s3 = new SampleStatus()
        s3.step = 3
        s3.label = "working"
        s3.trackingTypeId = ct.id
        await SampleStatusDAO.getInstance().add(s3)

        let s4 = new SampleStatus()
        s4.step = 4
        s4.label = "finished"
        s4.trackingTypeId = ct.id
        await SampleStatusDAO.getInstance().add(s4)

        // Alter the default value of an element of table
        await (async()=>{
            return new Promise((resolve, reject)=>{
                DatabaseManager.getInstance().connection.query("" +
                    "ALTER TABLE `testSample` " +
                    "MODIFY COLUMN testSample_trackingTypeId INT(6) UNSIGNED DEFAULT "+ct.id,
                    function(err, res){
                        if(err){
                            reject(err)
                            throw(err)
                        }
                        resolve(res)
                    }
                )
            })
        })()
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

        // Add data that will be used
        await this.initSampleState();
    }
}
module.exports = InstallationBL
