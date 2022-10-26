
let assertNotEmptyFile = (raw, key, e)=>{
    if(raw[key] == undefined)
        e[key] = "EMPTY_ERROR"
    if(raw[key] && raw[key].content.trim().length == 0)
        e[key] = "EMPTY_ERROR"
}
module.exports = assertNotEmptyFile
