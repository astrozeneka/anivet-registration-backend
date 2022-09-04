function isValidPhone(input_str) {
    var re = /^\(?(\d{3})\)?[- ]?(\d{3})[- ]?(\d{4})$/;
    var re = /^[\d\+\-]+$/
    return re.test(input_str);
}
module.exports = isValidPhone
