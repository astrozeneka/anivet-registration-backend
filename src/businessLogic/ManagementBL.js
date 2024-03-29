const BaseBL = require("./BaseBL");
const _ = require('lodash')
const SampleParcel = require("../model/SampleParcel");
const SampleParcelDAO = require("../dao/SampleParcelDAO");
const TimeBL = require("./TimeBL");
const MessageDAO = require("../dao/MessageDAO");
const SciDoc = require("../model/SciDoc");
const SciDocDAO = require("../dao/SciDocDAO");

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
        let output = await SampleParcelDAO.getInstance().getAll()
        return output
    }

    async listDocuments(){
        let output = await SciDocDAO.getInstance().getAll()
        return output
    }

    async listCertifications(){

    }

    async doAddParcel(
        {
            reference,
            deliveryService,
            testSampleId,
            triggererId,
            file
        }
    ){
        // The validation should be done by the Security BL
        let model = new SampleParcel()
        model.reference = reference
        model.deliveryService = deliveryService
        model.testSampleId = testSampleId
        model.triggererId = triggererId
        model.file = file
        if(TimeBL.getInstance().time != null)
            model.date = TimeBL.getInstance().time
        else
            model.date = new Date()
        await SampleParcelDAO.getInstance().add(model)

        return {
            "object": model
        }
    }

    async doUploadDocument(
        {
            reference,
            type,
            testSampleId,
            triggererId,
            file
        }
    ){
        // The validation should be done by the Security BL
        let model = new SciDoc()
        model.reference = reference
        model.type = type
        model.testSampleId = testSampleId
        model.triggererId = triggererId
        model.file = file
        if(TimeBL.getInstance().time != null)
            model.date = TimeBL.getInstance().time
        else
            model.date = new Date()
        await SciDocDAO.getInstance().add(model)

        return {
            "object": model
        }
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
