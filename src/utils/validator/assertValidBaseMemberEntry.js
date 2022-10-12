const assertNotEmpty = require("./assertNotEmpty");
const assertValidPhone = require("./assertValidPhone");
const assertValidEmail = require("./assertValidEmail");

let assertValidBaseMemberEntry = (raw, e, bypassAddress)=>{
    if(bypassAddress == undefined)
        bypassAddress = false

    assertNotEmpty(raw, "name1", e)
    assertNotEmpty(raw, "name2", e)
    assertValidPhone(raw, "phone", e)
    assertValidEmail(raw, "email", e)
    assertNotEmpty(raw, "username", e)
    if(!bypassAddress) {
        assertNotEmpty(raw, "address1", e)
        assertNotEmpty(raw, "country", e)
        assertNotEmpty(raw, "postcode", e)
    }
}
module.exports = assertValidBaseMemberEntry
