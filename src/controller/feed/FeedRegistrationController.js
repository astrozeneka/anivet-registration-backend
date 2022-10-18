const BaseFeedController = require("./BaseFeedController");


class FeedRegistrationController extends BaseFeedController{
    static instance = null;
    static getInstance(){
        if(this.instance == null) {
            this.instance = new FeedRegistrationController()
        }
        return this.instance
    }
    static tearDown(){
        this.instance = null;
    }

    name = "registration"

}
module.exports = FeedRegistrationController
