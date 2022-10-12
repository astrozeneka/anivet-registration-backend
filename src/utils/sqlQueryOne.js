const DatabaseManager = require("../service/DatabaseManager");


async function sqlQueryOne(...params){
    let factory = params.pop()
    return new Promise((resolve, reject)=>{
        DatabaseManager.getInstance().connection.query(...params, (err, res)=>{
            if(err){
                throw err;
                reject(err)
            }
            if(res.length == 0)
                resolve(null)
            else
                resolve(factory(res[0]))
        })
    })
}
module.exports = sqlQueryOne
