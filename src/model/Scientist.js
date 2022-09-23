const BaseMember = require("./BaseMember");

class Scientist extends BaseMember{

    #address = null
    #type = "scientist"

    serialize(){
        let output = super.serialize()
        if(this.address != null)
            output.address = this.address.serialize()
        return output
    }
}
module.exports = Scientist
