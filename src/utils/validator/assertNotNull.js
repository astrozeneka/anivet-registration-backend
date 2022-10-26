
let assertNotNull = (raw, key, e)=>{
    if(raw[key] == undefined)
        e[key] = "EMPTY_ERROR"
    if(raw[key] == 0)
        e[key] = "NULL_ERROR"
}
module.exports = assertNotNull
