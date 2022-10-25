const SciDocDAO = require("./SciDocDAO");

class TestResultDAO extends SciDocDAO{
    static instance = null;
    static getInstance(){
        if(this.instance == null) {
            this.instance = new TestResultDAO()
        }
        return this.instance
    }
    static tearDown(){
        this.instance = null;
    }

    name = "testResult"
}
module.exports = TestResultDAO
