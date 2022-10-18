const BaseFeedController = require("./BaseFeedController");

class FeedSiteController extends BaseFeedController{
    static instance = null;
    static getInstance(){
        if(this.instance == null) {
            this.instance = new FeedSiteController()
        }
        return this.instance
    }
    static tearDown(){
        this.instance = null;
    }

    name = "site"
}
module.exports = FeedSiteController
