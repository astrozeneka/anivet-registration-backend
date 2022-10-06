const DatabaseManager = require("../service/DatabaseManager");


async function sqlQueryMultiple(...params){
    let factory = params.pop()
    return new Promise((resolve, reject)=>{
        DatabaseManager.getInstance().connection.query(...params, (err, res)=>{
            if(err){
                throw err;
                reject(err)
            }
            let output = []
            for(let rdp of res)
                output.push(factory(rdp))
            resolve(output)
        })
    })
}
module.exports = sqlQueryMultiple
