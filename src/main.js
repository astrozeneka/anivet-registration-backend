const express = require('express')
const APIController = require("./controller/APIController");
const PublicController = require("./controller/PublicController");
const cors = require('cors')
const APIV1Controller = require("./controller/APIV1Controller");
const InstallationController = require("./controller/InstallationController");
const app = express()
let bodyParser = require("body-parser")
const morgan = require("morgan");
app.use(bodyParser({limit: '50mb'}));
app.use(express.json());
const port = process.env.PORT || 3001

var allowedOrigins = [
    'http://localhost:8080',
    'http://anivet.local'
    //'http://yourapp.com'
];
/*app.use(cors({
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
}));*/
app.use(cors())



app.get('/', (req, res) => {
    res.send('Hello World!')
})

//APIController.getInstance().register(app, "/api/v1")


app.use(require('morgan')('dev'))
app.use((req, res, next)=>{
    morgan(':method :url :status :res[content-length] - :response-time ms')
    next()
})

// Main API
app.use('/api/v1', APIV1Controller.getInstance().app)

// Public sub-application
app.use('/public', PublicController.getInstance().app)
app.use('/install', InstallationController.getInstance().app)


app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})

module.exports = app
