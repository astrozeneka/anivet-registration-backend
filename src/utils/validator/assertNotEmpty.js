
let assertNotEmpty = (raw, key, e)=>{
    if(raw[key] == undefined)
        e[key] = "EMPTY_ERROR"
    else if(raw[key].trim().length == 0)
        e[key] = "EMPTY_ERROR"
}
module.exports = assertNotEmpty
