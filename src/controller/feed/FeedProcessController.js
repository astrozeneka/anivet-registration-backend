const BaseFeedController = require("./BaseFeedController");

class FeedProcessController extends BaseFeedController{
    static instance = null
    static getInstance(){
        if(this.instance == null) {
            this.instance = new FeedProcessController()
        }
        return this.instance
    }
    static tearDown(){
        this.instance = null;
    }

    name="process"
}
module.exports = FeedProcessController
