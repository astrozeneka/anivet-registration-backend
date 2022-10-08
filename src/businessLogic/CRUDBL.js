const CRUDBLUtils = require("../utils/validator/assertNotEmpty");
const assertNotEmpty = require("../utils/validator/assertNotEmpty");
const assertValidPhone = require("../utils/validator/assertValidPhone");
const assertValidEmail = require("../utils/validator/assertValidEmail");
const lodash = require("lodash")
const OwnerDAO = require("../dao/crud/OwnerDAO");
const assertValidPassword = require("../utils/validator/assertValidPassword");
const AddressDAO = require("../dao/crud/AddressDAO");
const assertValidBaseMemberEntry = require("../utils/validator/assertValidBaseMemberEntry");

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
        let o = await dao.getOne(view, id)
        // For security reason
        if(o.password)
            o.password = ""
        return o
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
        async update(raw){
            let e = {}
            assertValidBaseMemberEntry(raw, e)
            if(raw["password"].trim().length != 0) // Only for updates, not for insertion
                assertValidPassword(raw, "password", "passwordCheck", e)
            if(!lodash.isEmpty(e))
                return {errors: e}

            // Update entity
            let old = OwnerDAO.getInstance().model_to_raw[""](
                await OwnerDAO.getInstance().getOne("", raw.id)
            )
            for(const key in raw) old[key] = raw[key] || old[key]
            let m = OwnerDAO.getInstance().raw_to_model(old)
            await OwnerDAO.getInstance().update(m)

            // UPDATE ADDRESS
            let old_a = AddressDAO.getInstance().model_to_raw[""](
                await AddressDAO.getInstance().getOneByBaseMemberId("", raw.id)
            )
            let tmp_id = old_a.id
            for(const key in raw) old_a[key] = raw[key] || old[key]
            let m_a = AddressDAO.getInstance().raw_to_model(old_a)
            m_a.id = tmp_id // Secondary entity adjustment (VERY IMPORTANT)
            await AddressDAO.getInstance().update(m_a)

            /**
             * In the next architecture iteration,
             * it is preferable to not to merge two entities
             */
            return {object: null}
        },
        async delete(raw){
            let m = OwnerDAO.getInstance().raw_to_model(raw)
            let u = await OwnerDAO.getInstance().delete(m)
            if(u > 0)
                return {affectedRows: u}
            else
                return {errors: {"form": "DELETION_ERROR"}}
        }
    }
}
module.exports = CRUDBL
