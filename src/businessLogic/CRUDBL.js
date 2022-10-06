const CRUDBLUtils = require("../utils/validator/assertNotEmpty");
const assertNotEmpty = require("../utils/validator/assertNotEmpty");
const assertValidPhone = require("../utils/validator/assertValidPhone");
const assertValidEmail = require("../utils/validator/assertValidEmail");
const lodash = require("lodash")
const OwnerDAO = require("../dao/crud/OwnerDAO");

class CRUDBL {
    static instance = null;
    static getInstance(){
        if(this.instance == null) {
            this.instance = new CRUDBL()
        }
        return this.instance
    }
    static tearDown(){
        this.instance = null;
    }

    async loadView(dao, view){
        return await dao.getAll(view)
        // USE DAO
    }

    breeder={
        insert(raw){
            let e = {}
            super.assertNotEmpty(raw, "name1", e)
            console.log()
        },
        update(raw){

        },
        delete(raw){

        }
    }

    owner={
        async insert(raw){
            let e = {}
            assertNotEmpty(raw, "name1", e)
            assertNotEmpty(raw, "name2", e)
            assertValidPhone(raw, "phone", e)
            assertValidEmail(raw, "email", e)
            if(!lodash.isEmpty(e))
                return {errors: e}

            let m = OwnerDAO.getInstance().raw_to_model(raw)
            await OwnerDAO.getInstance().add(m);
            return {object: m}
        },
        update(raw){

        },
        delete(raw){

        }
    }
}
module.exports = CRUDBL
