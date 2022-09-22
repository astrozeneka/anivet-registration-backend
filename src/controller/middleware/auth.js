const jwt = require('jsonwebtoken')
const dotenv = require('dotenv')
dotenv.config()

module.exports = (req, res, next)=>{
    console.log('OKOK: it works')
    try{
        const token = req.headers.authorization.split(' ')[1]
        const decodedToken = jwt.verify(token, process.env.TOKEN_SECRET)
        const userId = decodedToken.userId
        req.decodedToken = decodedToken
        next()
    }catch (e){
        req.decodedToken = null
        next()
    }
}
