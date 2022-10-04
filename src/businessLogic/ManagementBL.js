const BaseBL = require("./BaseBL");

class ManagementBL extends BaseBL{
    static instance = null;
    static getInstance(){
        if(this.instance == null) {
            this.instance = new ManagementBL()
        }
        return this.instance
    }
    static tearDown(){
        this.instance = null;
    }

    async listParcels(){

    }

    async listDocuments(){

    }

    async listCertifications(){

    }

    async doAddParcel(){
        // The validation should be done by the Security BL

    }

    async doUploadDocument(){
        // The validation should be done by the Security BL

    }

    async doUploadCertification(){
        // The validation should be done by the Security BL

    }

    async doUpdateParcel(){

    }

    async doUpdateDocument(){

    }

    async doUpdateCertification(){

    }

    async doDeleteParcel(){

    }

    async doDeleteDocument(){

    }

    async doDeleteCertification(){

    }

    async viewParcel(){

    }

    async viewDocument(){

    }

    async viewCertification(){

    }

}
module.exports = ManagementBL
