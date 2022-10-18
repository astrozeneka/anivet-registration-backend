const BaseFeedController = require("./BaseFeedController");

class FeedMessageController extends BaseFeedController {
    static instance = null;
    static getInstance(){
        if(this.instance == null) {
            this.instance = new FeedMessageController()
        }
        return this.instance
    }
    static tearDown(){
        this.instance = null;
    }

    name="message"
}
module.exports = FeedMessageController
