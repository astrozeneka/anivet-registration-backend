const BaseBL = require("./BaseBL");
const ManagementBL = require("./ManagementBL");
const _ = require('lodash')

class SecurityBL extends BaseBL{
    static instance = null;
    static getInstance(){
        if(this.instance == null) {
            this.instance = new SecurityBL()
        }
        return this.instance
    }
    static tearDown(){
        this.instance = null;
    }

    async addParcel(
        {
            reference,
            deliveryService,
            testSampleId,
            triggererId,
            file
        }
    ){
        /** Handle exceptions */
        let errors = {}
        if(reference == "")
            errors["reference"] = "EMPTY_REFERENCE"
        if(testSampleId == "")
            errors["testSampleId"] = "EMPTY_SAMPLE"
        if(file.length == 0)
            errors["file"] = "EMPTY_FILE"
        // Delivery service is optional
        if(file.length > 1000000)
            errors["file"] = "FILE_TOO_HEAVY"
        if(!_.isEmpty(errors))
            return {"errors": errors}

        return await ManagementBL.getInstance().doAddParcel({
            reference,
            deliveryService,
            testSampleId,
            triggererId,
            file
        })

    }

    async uploadDocument(){

    }

    async uploadCertification(){

    }
}
module.exports = SecurityBL
