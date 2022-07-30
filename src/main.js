const express = require('express')
const APIController = require("./controller/APIController");
const app = express()
app.use(express.json());
const port = process.env.PORT || 3000

var server = require("../")

app.get('/', (req, res) => {
    res.send('Hello World!')
})

APIController.getInstance().register(app, "/api/v1")

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})

module.exports = app