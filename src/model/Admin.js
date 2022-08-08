const BaseMember = require('./BaseMember')

class Admin extends BaseMember{
    serialize() {
        return {
            id: this.id,
            username: this.username,
            password: this.password,
            website: this.website
        }
    }
}

module.exports = Admin
