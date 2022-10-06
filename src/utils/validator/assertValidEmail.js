
let assertValidEmail = (raw, key, e)=>{
    if(
        !String(raw[key])
            .toLowerCase()
            .match(
                /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
            )
    ){
        e[key] = "INVALID_ERROR"
    }
}
module.exports = assertValidEmail
