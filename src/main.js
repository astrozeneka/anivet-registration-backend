const express = require('express')
const APIController = require("./controller/APIController");
const cors = require('cors')
const app = express()
app.use(express.json());
const port = process.env.PORT || 3001

var allowedOrigins = [
    'http://localhost:8080',
    //'http://yourapp.com'
];
app.use(cors({
    origin: function(origin, callback){
        // allow requests with no origin
        // (like mobile apps or curl requests)
        if(!origin) return callback(null, true);
        if(allowedOrigins.indexOf(origin) === -1){
            var msg = 'The CORS policy for this site does not ' +
                'allow access from the specified Origin.';
            return callback(new Error(msg), false);
        }
        return callback(null, true);
    }
}));


var server = require("../")

app.get('/', (req, res) => {
    res.send('Hello World!')
})

APIController.getInstance().register(app, "/api/v1")

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})

module.exports = app
