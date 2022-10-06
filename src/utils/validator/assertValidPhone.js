
let assertValidPhone = (raw, key, e)=>{
    var re = /^\(?(\d{3})\)?[- ]?(\d{3})[- ]?(\d{4})$/;
    var re = /^[\d\+\-]+$/
    if(!re.test(raw[key]))
        e[key] = "INVALID_ERROR"
}
module.exports = assertValidPhone
