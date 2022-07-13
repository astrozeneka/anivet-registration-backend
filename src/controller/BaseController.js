
class BaseController {
    prefix = ""

    register(app, prefix){
        if(prefix != undefined) this.prefix = prefix
    }
}

module.exports = BaseController