const InstallationBL = require("./businessLogic/InstallationBL");
const DatabaseManager = require("../src/service/DatabaseManager")
DatabaseManager.getInstance().init()

;(async()=>{// ASYNCHRONOUS SCRIPT
    await InstallationBL.getInstance().installDB()
    console.log("Database reinstalled")
    return
})()
