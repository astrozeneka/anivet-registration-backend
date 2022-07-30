const BaseController = require("./BaseController");
const AddressDAO = require("../dao/AddressDAO");
const BreedDAO = require("../dao/BreedDAO");
const OwnerDAO = require("../dao/OwnerDAO");
const TestOrderDAO = require("../dao/TestOrderDAO");
const TestSampleDAO = require("../dao/TestSampleDAO");
const path = require("path");


class InstallationController extends BaseController{

    static instance = null;
    static getInstance(){
        if(this.instance == null) {
            this.instance = new InstallationController()
        }
        return this.instance
    }
    static tearDown(){
        this.instance = null;
    }

    prefix = ""

    constructor(){
        super();

        this.ad = AddressDAO.getInstance()
        this.bd = BreedDAO.getInstance()
        this.od = OwnerDAO.getInstance()
        this.tod = TestOrderDAO.getInstance()
        this.tsd = TestSampleDAO.getInstance()
    }

    register(app, prefix){
        super.register(app, prefix)

        app.get(path.join(this.prefix), async (req, res)=>{

            await this.ad.destroyTable()
            await this.od.destroyTable()
            await this.tsd.destroyTable()
            await this.tod.destroyTable()
            await this.bd.destroyTable()

            await this.bd.buildTable() // Breed Table
            await this.tod.buildTable() // TestOrder Table
            await this.tsd.buildTable() // TestSample Table
            await this.od.buildTable() // Owner Table
            await this.ad.buildTable() // Address Table

            res.send("Installation completed")
            console.log("Installation completed")
        })
    }

}

module.exports = InstallationController