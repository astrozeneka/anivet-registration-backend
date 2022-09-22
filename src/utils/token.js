const BaseMemberDAO = require("../dao/BaseMemberDAO");
const Admin = require("../model/Admin");

async function isAdminToken(decodedToken){
    if(decodedToken != null){
        let a = await BaseMemberDAO.getInstance().getById(decodedToken.id)
        return a instanceof Admin
    }
    return false
}

module.exports = {isAdminToken}
