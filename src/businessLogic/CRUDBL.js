const CRUDBLUtils = require("../utils/validator/assertNotEmpty");
const assertNotEmpty = require("../utils/validator/assertNotEmpty");
const assertValidPhone = require("../utils/validator/assertValidPhone");
const assertValidEmail = require("../utils/validator/assertValidEmail");
const lodash = require("lodash")
const OwnerDAO = require("../dao/crud/OwnerDAO");
const assertValidPassword = require("../utils/validator/assertValidPassword");
const AddressDAO = require("../dao/crud/AddressDAO");

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

    async loadOne(dao, view, id){
        return await dao.getOne(view, id)
    }

    async loadView(dao, view){ // use loadAll instead
        return await dao.getAll(view)
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
            assertNotEmpty(raw, "address1", e)
            assertNotEmpty(raw, "country", e)
            assertNotEmpty(raw, "postcode", e)
            assertNotEmpty(raw, "username", e)
            assertValidPassword(raw, "password", "passwordCheck", e)
            if(!lodash.isEmpty(e))
                return {errors: e}

            let m = OwnerDAO.getInstance().raw_to_model(raw)
            await OwnerDAO.getInstance().add(m);
            let a = AddressDAO.getInstance().raw_to_model(raw)
            a.baseMemberId = m.id
            await AddressDAO.getInstance().add(a)
            return {object: m}
        },
        update(raw){

        },
        delete(raw){

        }
    }
}
module.exports = CRUDBL
