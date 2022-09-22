const express = require('express')
const APIController = require("./controller/APIController");
const PublicController = require("./controller/PublicController");
const cors = require('cors')
const APIV1Controller = require("./controller/APIV1Controller");
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



app.get('/', (req, res) => {
    res.send('Hello World!')
})

//APIController.getInstance().register(app, "/api/v1")

// Main API
app.use('/api/v1', APIV1Controller.getInstance().app)

// Public sub-application
app.use('/public', PublicController.getInstance().app)


app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})

module.exports = app
