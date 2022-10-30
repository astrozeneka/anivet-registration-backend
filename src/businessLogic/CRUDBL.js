const CRUDBLUtils = require("../utils/validator/assertNotEmpty");
const assertNotEmpty = require("../utils/validator/assertNotEmpty");
const assertValidPhone = require("../utils/validator/assertValidPhone");
const assertValidEmail = require("../utils/validator/assertValidEmail");
const lodash = require("lodash")
const OwnerDAO = require("../dao/crud/OwnerDAO");
const assertValidPassword = require("../utils/validator/assertValidPassword");
const AddressDAO = require("../dao/crud/AddressDAO");
const assertValidBaseMemberEntry = require("../utils/validator/assertValidBaseMemberEntry");
const BreederDAO = require("../dao/crud/BreederDAO");
const VetDAO = require("../dao/crud/VetDAO");
const ScientistDAO = require("../dao/crud/ScientistDAO");
const AdminDAO = require("../dao/crud/AdminDAO");
const SciDocDAO = require("../dao/crud/SciDocDAO");
const FileDAO = require("../dao/crud/FileDAO");
const assertNotEmptyFile = require("../utils/validator/assertNotEmptyFile");
const PaymentReceiptDAO = require("../dao/crud/PaymentReceiptDAO");
const TestSampleDAO = require("../dao/crud/TestSampleDAO");
const SampleParcelDAO = require("../dao/crud/SampleParcelDAO");
const assertNotNull = require("../utils/validator/assertNotNull");
const TestResultDAO = require("../dao/crud/TestResultDAO");
const TestOrderDAO = require("../dao/crud/TestOrderDAO");
const ValidationNoteDAO = require("../dao/crud/ValidationNoteDAO");
const CertificationDAO = require("../dao/crud/CertificationDAO");

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

    async loadView(dao, view, offset, limit){ // use loadAll instead
        return await dao.getAll(view, offset, limit)
    }

    async searchView(dao, view, offset, limit, searchQuery){
        return await dao.searchAll(view, offset, limit, searchQuery)
    }

    async loadProps(dao){
        return await dao.getProps()
    }

    breeder={
        async insert(raw){
            let e = {}
            // To be tested
            assertValidBaseMemberEntry(raw, e)
            assertValidPassword(raw, "password", "passwordCheck", e)
            if(!lodash.isEmpty(e))
                return {errors: e}

            let m = BreederDAO.getInstance().raw_to_model(raw)
            await BreederDAO.getInstance().add(m)
            let a = AddressDAO.getInstance().raw_to_model(raw)
            a.baseMemberId = m.id
            await AddressDAO.getInstance().add(a)
            return {object: m}
        },
        async update(raw){
            let e = {}
            assertValidBaseMemberEntry(raw, e)
            if(raw["password"])
                if(raw["password"].trim().length != 0) // Only for updates, not for insertion
                    assertValidPassword(raw, "password", "passwordCheck", e)
            if(!lodash.isEmpty(e))
                return {errors: e}

            // Update entity
            let old = BreederDAO.getInstance().model_to_raw[""](
                await BreederDAO.getInstance().getOne("", raw.id)
            )

            for(const key in raw) old[key] = raw[key] || old[key]
            let m = BreederDAO.getInstance().raw_to_model(old)
            await BreederDAO.getInstance().update(m)

            // UPDATE ADDRESS
            let old_a = AddressDAO.getInstance().model_to_raw[""](
                await AddressDAO.getInstance().getOneByBaseMemberId("", raw.id)
            )
            let tmp_id = old_a.id
            for(const key in raw) old_a[key] = raw[key] || old[key]
            let m_a = AddressDAO.getInstance().raw_to_model(old_a)
            m_a.id = tmp_id // Secondary entity adjustment (VERY IMPORTANT)
            await AddressDAO.getInstance().update(m_a)

            return {object: null}
        },
        async delete(raw){
            let m = BreederDAO.getInstance().raw_to_model(raw)
            let u = await BreederDAO.getInstance().delete(m)
            if(u > 0)
                return {affectedRows: u}
            else
                return {errors: {"form": "DELETION_ERROR"}}
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
            if(raw["password"])
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

    vet = {
        async insert(raw){
            let e = {}
            // To be tested
            assertValidBaseMemberEntry(raw, e)
            assertValidPassword(raw, "password", "passwordCheck", e)
            if(!lodash.isEmpty(e))
                return {errors: e}

            let m = VetDAO.getInstance().raw_to_model(raw)
            await VetDAO.getInstance().add(m)
            let a = AddressDAO.getInstance().raw_to_model(raw)
            a.baseMemberId = m.id
            await AddressDAO.getInstance().add(a)
            return {object: m}
        },
        async update(raw){
            let e = {}
            assertValidBaseMemberEntry(raw, e)

            if(raw["password"])
                if(raw["password"].trim().length != 0) // Only for updates, not for insertion
                    assertValidPassword(raw, "password", "passwordCheck", e)
            if(!lodash.isEmpty(e))
                return {errors: e}

            // Update entity
            let old = VetDAO.getInstance().model_to_raw[""](
                await VetDAO.getInstance().getOne("", raw.id)
            )

            for(const key in raw) old[key] = raw[key] || old[key]
            let m = VetDAO.getInstance().raw_to_model(old)
            await VetDAO.getInstance().update(m)

            // UPDATE ADDRESS
            let old_a = AddressDAO.getInstance().model_to_raw[""](
                await AddressDAO.getInstance().getOneByBaseMemberId("", raw.id)
            )
            let tmp_id = old_a.id
            for(const key in raw) old_a[key] = raw[key] || old[key]
            let m_a = AddressDAO.getInstance().raw_to_model(old_a)
            m_a.id = tmp_id // Secondary entity adjustment (VERY IMPORTANT)
            await AddressDAO.getInstance().update(m_a)

            return {object: null}
        },
        async delete(raw){
            let m = VetDAO.getInstance().raw_to_model(raw)
            let u = await VetDAO.getInstance().delete(m)
            if(u > 0)
                return {affectedRows: u}
            else
                return {errors: {"form": "DELETION_ERROR"}}
        }
    }

    scientist = {
        async insert(raw){
            let e = {}
            assertValidBaseMemberEntry(raw, e, true)
            assertValidPassword(raw, "password", "passwordCheck", e)
            if(!lodash.isEmpty(e))
                return {errors: e}

            let m = ScientistDAO.getInstance().raw_to_model(raw)
            await ScientistDAO.getInstance().add(m)
            return {object: m}
        },
        async update(raw){
            let e = {}
            assertValidBaseMemberEntry(raw, e, true)
            if(raw["password"])
                if(raw["password"].trim().length != 0) // Only for updates, not for insertion
                    assertValidPassword(raw, "password", "passwordCheck", e)
            if(!lodash.isEmpty(e))
                return {errors: e}

            // Update entity
            let old = ScientistDAO.getInstance().model_to_raw[""](
                await ScientistDAO.getInstance().getOne("", raw.id)
            )
            for(const key in raw) old[key] = raw[key] || old[key]
            let m = ScientistDAO.getInstance().raw_to_model(old)
            await ScientistDAO.getInstance().update(m)

            return {object: null}
        },
        async delete(raw){
            let m = ScientistDAO.getInstance().raw_to_model(raw)
            let u = await ScientistDAO.getInstance().delete(m)
            if(u > 0)
                return {affectedRows: u}
            else
                return {errors: {"form": "DELETION_ERROR"}}
        }
    }

    admin = {
        async insert(raw){
            let e = {} // เหมือนนักวีท
            assertValidBaseMemberEntry(raw, e, true)
            assertValidPassword(raw, "password", "passwordCheck", e)
            if(!lodash.isEmpty(e))
                return {errors: e}

            let m = AdminDAO.getInstance().raw_to_model(raw)
            await AdminDAO.getInstance().add(m)
            return {object: m}
        },
        async update(raw){
            let e = {}
            assertValidBaseMemberEntry(raw, e, true)
            if(raw["password"])
                if(raw["password"].trim().length != 0)
                    assertValidPassword(raw, "password", "passwordCheck", e)
            if(!lodash.isEmpty(e))
                return {errors: e}

            let old = AdminDAO.getInstance().model_to_raw[""](
                await AdminDAO.getInstance().getOne("", raw.id)
            )
            for(const key in raw) old[key] = raw[key] || old[key]
            let m = AdminDAO.getInstance().raw_to_model(old)
            await AdminDAO.getInstance().update(m)

            return {object: null}
        },
        async delete(raw){
            let m = AdminDAO.getInstance().raw_to_model(raw)
            let u = await AdminDAO.getInstance().delete(m)
            if(u > 0)
                return {affectedRows: u}
            else
                return {errors: {"form": "DELETION_ERROR"}}
        }
    }

    sciDoc = {
        async insert(raw){
            let e = {}
            assertNotEmpty(raw, "reference", e)
            assertNotEmpty(raw, "type", e)
            // TO be fixed
            assertNotEmpty(raw.file, "content", e)
            if(!lodash.isEmpty(e))
                return {errors: e}

            // Add file first
            let f = FileDAO.getInstance().raw_to_model(raw.file)
            await FileDAO.getInstance().add(f)

            // And after add entity
            let m = SciDocDAO.getInstance().raw_to_model(raw)
            m.fileId = f.id
            await SciDocDAO.getInstance().add(m)
            return {object: m}
        },
        async update(raw){
            let e = {}
            assertNotEmpty(raw, "reference", e)
            assertNotEmpty(raw, "type", e)
            if(!lodash.isEmpty(e)) return {errors: e}

            // Update entity
            let old = SciDocDAO.getInstance().model_to_raw[""](
                await SciDocDAO.getInstance().getOne("", raw.id)
            )
            for(const key in raw) old[key] = raw[key] || old[key]
            let m = SciDocDAO.getInstance().raw_to_model(old)

            // Update file
            if(raw.file){
                // Delete the previous one
                await FileDAO.getInstance().delete({id: m.fileId}) // IMPORTANT, update code on the next iteration

                // Add the new one
                let f = await FileDAO.getInstance().raw_to_model(raw.file)
                await FileDAO.getInstance().add(f)

                // Update ID
                m.fileId = f.id
            }

            await SciDocDAO.getInstance().update(m)
            return {object: m}
        },
        async delete(raw){
            let m = SciDocDAO.getInstance().raw_to_model(raw)
            let u = await SciDocDAO.getInstance().delete(m)
            if(u > 0)
                return {affectedRows: u}
            else
                return {errors: {"form": "DELETION_ERROR"}}
        }
    }

    paymentReceipt = {
        async insert(raw){
            let e = {}
            assertNotEmpty(raw, "reference", e)
            assertNotEmpty(raw, "method", e)
            assertNotEmptyFile(raw, "file", e)
            if(!lodash.isEmpty(e)) return {errors: e}

            // Add file first
            let f = FileDAO.getInstance().raw_to_model(raw.file)
            await FileDAO.getInstance().add(f)

            // And after add entity
            let m = PaymentReceiptDAO.getInstance().raw_to_model(raw)
            m.fileId = f.id
            await PaymentReceiptDAO.getInstance().add(m)
            return {object: m}
        },
        async update(raw){
            let e = {}
            assertNotEmpty(raw, "reference", e)
            assertNotEmpty(raw, "method", e)
            if(!lodash.isEmpty(e)) return {errors: e}

            // Update entity
            let old = PaymentReceiptDAO.getInstance().model_to_raw[""](
                await PaymentReceiptDAO.getInstance().getOne("", raw.id)
            )
            for (const key in raw) old[key] = raw[key] || old[key]
            let m = PaymentReceiptDAO.getInstance().raw_to_model(old)

            if(raw.file){
                await FileDAO.getInstance().delete({id: old.fileId})
                let f = await FileDAO.getInstance().raw_to_model(raw.file)
                await FileDAO.getInstance().add(f)
                m.fileId = f.id
            }
            await PaymentReceiptDAO.getInstance().update(m)
            return {object: m}
        },
        async delete(raw){
            let m = PaymentReceiptDAO.getInstance().raw_to_model(raw)
            let u = await PaymentReceiptDAO.getInstance().delete(m)
            if(u > 0)
                return {affectedRows: u}
            else
                return {errors: {"form": "DELETION_ERROR"}}
        }
    }

    sampleParcel = {
        async insert(raw){
            let e = {}
            assertNotEmpty(raw, "reference", e)
            assertNotEmpty(raw, "deliveryService", e)
            assertNotNull(raw, "testSampleId", e)
            assertNotEmptyFile(raw, "file", e)
            if(!lodash.isEmpty(e)) return {errors: e}

            // Add file first
            let f = FileDAO.getInstance().raw_to_model(raw.file)
            await FileDAO.getInstance().add(f)

            // Add entity
            let m = SampleParcelDAO.getInstance().raw_to_model(raw)
            m.testSampleId = raw.testSampleId
            m.fileId = f.id
            await SampleParcelDAO.getInstance().add(m)
            return {object: m}
        },
        async update(raw){
            let e = {}
            assertNotEmpty(raw, "reference", e)
            assertNotEmpty(raw, "deliveryService", e)
            assertNotNull(raw, "testSampleId", e)
            if(!lodash.isEmpty(e)) return {errors: e}

            // Update entity
            let old = SampleParcelDAO.getInstance().model_to_raw[""](
                await SampleParcelDAO.getInstance().getOne("", raw.id)
            )
            for (const key in raw) old[key] = raw[key] || old[key]
            let m = SampleParcelDAO.getInstance().raw_to_model(old)

            if(raw.file){
                await FileDAO.getInstance().delete({id: old.fileId})
                let f = await FileDAO.getInstance().raw_to_model(raw.file)
                await FileDAO.getInstance().add(f)
                m.fileId = f.id
            }
            await SampleParcelDAO.getInstance().update(m)
            return {object: m}
        },
        async delete(raw){
            let m = SampleParcelDAO.getInstance().raw_to_model(raw)
            let u = await SampleParcelDAO.getInstance().delete(m)
            if(u > 0)
                return {affectedRows: u}
            else
                return {errors: {"form": "DELETION_ERROR"}}
        }
    }

    testOrder = {
        async insert(raw){
            let e = {}
            raw.memberId = raw.triggererId
            // ไม่มี validation

            // First, create entity
            let d = TestOrderDAO.getInstance().raw_to_model(raw)
            await TestOrderDAO.getInstance().add(d)

            // Update test sample then
            for (const sampleId of raw.samples){
                let s = await TestSampleDAO.getInstance().getOne("", sampleId)
                s.testOrderId = d.id
                await TestSampleDAO.getInstance().update(s)
            }

            return {object: d}
        },
        async update(raw){
            console.log()

            // Update entity first
            let old = TestOrderDAO.getInstance().model_to_raw[""](
                await TestOrderDAO.getInstance().getOne("", raw.id)
            )
            for (const key in raw) old[key] = raw[key] || old[key]
            let m = TestOrderDAO.getInstance().raw_to_model(old)
            await TestOrderDAO.getInstance().update(m)

            // Dissociate some testSamples
            for(const sampleId of raw.dissociatedSamples){
                let s = await TestSampleDAO.getInstance().getOne("", sampleId)
                s.testOrderId = null
                await TestSampleDAO.getInstance().update(s)
            }

            // Associate some testSamples
            for(const sampleId of raw.associatedSamples){
                let s = await TestSampleDAO.getInstance().getOne("", sampleId)
                s.testOrderId = m.id
                await TestSampleDAO.getInstance().update(s)
            }

            return {object: m}
        },
        async delete(raw){
            let m = TestOrderDAO.getInstance().raw_to_model(raw)
            let u = await TestOrderDAO.getInstance().delete(m)
            if(u > 0)
                return {affectedRows: u}
            else
                return {errors: {"form": "DELETION_ERROR"}}
        }
    }

    testSample = {
        async insert(raw){
            let e = {}
            //assertNotEmpty(raw, "type", e)
            assertNotEmpty(raw, "animal", e)
            assertNotEmpty(raw, "petSpecie", e)
            assertNotEmptyFile(raw, "image", e)
            if(!lodash.isEmpty(e)) return {errors: e}

            // Add file first
            let f = FileDAO.getInstance().raw_to_model(raw.image)
            await FileDAO.getInstance().add(f)

            // Add entity
            let m = TestSampleDAO.getInstance().raw_to_model(raw)
            m.imageId = f.id
            await TestSampleDAO.getInstance().add(m)
            return {object: m}
        },
        async update(raw) {
            let e = {}
            assertNotEmpty(raw, "type", e)
            assertNotEmpty(raw, "animal", e)
            assertNotEmpty(raw, "petSpecie", e)
            if(!lodash.isEmpty(e)) return {errors: e}

            // Update entity
            let old = TestSampleDAO.getInstance().model_to_raw[""](
                await TestSampleDAO.getInstance().getOne("", raw.id)
            )
            for (const key in raw) old[key] = raw[key] || old[key]
            let m = TestSampleDAO.getInstance().raw_to_model(old)

            if(raw.image){ // raw.image == raw.file
                await FileDAO.getInstance().delete({id: old.imageId})
                let f = await FileDAO.getInstance().raw_to_model(raw.image)
                await FileDAO.getInstance().add(f)
                m.imageId = f.id
            }
            await TestSampleDAO.getInstance().update(m)
            return {object: m}
        },
        async delete(raw){
            let m = TestSampleDAO.getInstance().raw_to_model(raw)
            let u = await TestSampleDAO.getInstance().delete(m)
            if(u > 0)
                return {affectedRows: u}
            else
                return {errors: {"form": "DELETION_ERROR"}}
        }
    }

    testResult = {
        async insert(raw){
            // A little trick (will be probably be deprecated later
            raw.sciDoc.file = raw.file // Image will be ok too
            raw.sciDoc.triggererId = raw.triggererId // Triggerer should be passed to the related class
            raw.sciDoc.date = raw.date

            let e = {}
            assertNotEmpty(raw.sciDoc, "reference", e)
            assertNotNull(raw.sciDoc, "testSampleId", e)
            assertNotEmptyFile(raw, "file", e)
            if(!lodash.isEmpty(e)) return {errors: e}

            // Upload document
            raw.sciDoc.type = "test-result"
            let doc = (await CRUDBL.getInstance().sciDoc.insert(raw.sciDoc))
            if(doc.hasOwnProperty('errors')) return {errors: doc.errors}
            else doc = doc.object

            // As usual, patch values
            let d = TestResultDAO.getInstance().raw_to_model(raw)
            d.sciDocId = doc.id
            await TestResultDAO.getInstance().add(d)

            return {object: d}
        },
        async update(raw){
            raw.sciDoc.file = raw.file

            // Update doc
            let doc = await CRUDBL.getInstance().sciDoc.update(raw.sciDoc)
            if(doc.hasOwnProperty('errors')) return {errors: doc.errors}
            else doc = doc.object

            // Patch values
            let old = TestResultDAO.getInstance().model_to_raw[""](
                await TestResultDAO.getInstance().getOne("", raw.id)
            )
            for (const key in raw) old[key] = raw[key] || old[key]
            let m = TestResultDAO.getInstance().raw_to_model(old)
            await TestResultDAO.getInstance().update(m)

            return {object: m}
        },
        async delete(raw){ // Second generation deletion BL function
            // Fetch item data
            let m = await TestResultDAO.getInstance().getOne("", raw.id)

            // delete related
            await CRUDBL.getInstance().sciDoc.delete({id: m.sciDocId})

            // Delete item
            let u = await TestResultDAO.getInstance().delete(m)
            if(u > 0)
                return {affectedRows: u}
            else
                return {errors: {"form": "DELETION_ERROR"}}
        }
    }

    certification = {
        async insert(raw){
            console.log()
            raw.validationNote.triggererId = raw.triggererId
            raw.validationNote.date = raw.date

            let e = {}
            assertNotNull(raw, "testResultId", e)
            assertNotEmptyFile(raw, "file")
            if(!lodash.isEmpty(e)) return {errors: e}

            // First add the validation note
            let v = ValidationNoteDAO.getInstance().raw_to_model(raw.validationNote)
            await ValidationNoteDAO.getInstance().add(v)
            raw.validationNoteId = v.id

            // Save file to DB
            let f = FileDAO.getInstance().raw_to_model(raw.file)
            await FileDAO.getInstance().add(f)
            raw.fileId = f.id

            // Add Entity
            let c = CertificationDAO.getInstance().raw_to_model(raw)
            await CertificationDAO.getInstance().add(c)

            return {object: c}
        },
        async update(raw){
            console.log()
            raw.validationNote.triggererId = raw.triggererId
            raw.validationNote.date = raw.date

            let e = {}
            assertNotNull(raw, "testResultId", e)
            if(!lodash.isEmpty(e)) return {errors: e}

            // Update validation note
            let old_v = ValidationNoteDAO.getInstance().model_to_raw[""](
                await ValidationNoteDAO.getInstance().getOne("", raw.validationNote.id))
            for (const key in raw.validationNote) old_v[key] = raw.validationNote[key] || old_v[key]
            let v = ValidationNoteDAO.getInstance().raw_to_model(old_v)
            await ValidationNoteDAO.getInstance().update(v)
            raw.validationNoteId = v.id // Very important

            // Update entity
            let old = CertificationDAO.getInstance().model_to_raw[""](
                await CertificationDAO.getInstance().getOne("", raw.id))
            for (const key in raw) old[key] = raw[key] || old[key]
            let m = CertificationDAO.getInstance().raw_to_model(old)

            // Update file
            if(raw.file){
                await FileDAO.getInstance().delete({id: old.fileId})
                let f = await FileDAO.getInstance().raw_to_model(raw.file)
                await FileDAO.getInstance().add(f)
                m.fileId = f.id // Very important
            }
            await CertificationDAO.getInstance().update(m)
            return {object: m}
        },
        async delete(raw){
            let m = CertificationDAO.getInstance().raw_to_model(raw)
            let u = await CertificationDAO.getInstance().delete(m)
            if(u > 0)
                return {affectedRows: u}
            else
                return {errors: {"form": "DELETION_ERROR"}}
        }
    }
}
module.exports = CRUDBL
