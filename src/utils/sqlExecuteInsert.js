const DatabaseManager = require("../service/DatabaseManager");

async function sqlExecute(...params){
    return new Promise((resolve, reject)=>{
        DatabaseManager.getInstance().connection.query(...params, (err, res)=>{
            if(err){
                reject(err)
                throw(err)
            }
            resolve(res)
        })
    })
}
module.exports = sqlExecute
