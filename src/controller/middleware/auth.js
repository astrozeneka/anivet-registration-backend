const jwt = require('jsonwebtoken')
const dotenv = require('dotenv')
dotenv.config()

module.exports = (req, res, next)=>{
    try{
        const token = req.headers.authorization.split(' ')[1]
        const decodedToken = jwt.verify(token, process.env.TOKEN_SECRET)
        const userId = decodedToken.userId
        req.decodedToken = decodedToken
        next()
    }catch (e){
        req.decodedToken = null
        res.status(401).send("Unauthorized HTTP")
        //next()
    }
}
