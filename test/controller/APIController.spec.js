
const DatabaseManager = require("../../src/service/DatabaseManager")
var chai = require('chai');
let chaiHttp = require('chai-http');
var assert = chai.assert;
var server = require("../../src/main")

chai.use(chaiHttp)

describe('/GET /', () => {
    it('shouldn\'t be any error', (done) => {
        chai.request(server)
            .get('/api/v1/')
            .end((err, res) => {
                assert(err == null)
                done()
            });
    });
});