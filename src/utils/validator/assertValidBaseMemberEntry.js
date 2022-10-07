const assertNotEmpty = require("./assertNotEmpty");
const assertValidPhone = require("./assertValidPhone");
const assertValidEmail = require("./assertValidEmail");

let assertValidBaseMemberEntry = (raw, e)=>{
    assertNotEmpty(raw, "name1", e)
    assertNotEmpty(raw, "name2", e)
    assertValidPhone(raw, "phone", e)
    assertValidEmail(raw, "email", e)
    assertNotEmpty(raw, "address1", e)
    assertNotEmpty(raw, "country", e)
    assertNotEmpty(raw, "postcode", e)
    assertNotEmpty(raw, "username", e)
}
module.exports = assertValidBaseMemberEntry
