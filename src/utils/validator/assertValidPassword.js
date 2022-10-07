
let assertValidPassword = (raw, passwordKey, passwordCheckKey, e)=>{
    if(raw[passwordKey].length < 8)
        e[passwordKey] = "TOO_SHORT"
    if(raw[passwordKey] != raw[passwordCheckKey])
        e[passwordCheckKey] = "MISMATCH"
}
module.exports = assertValidPassword
