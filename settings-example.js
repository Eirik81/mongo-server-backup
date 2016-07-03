module.exports = {
    mongodumpPath : "c:/mongodb/bin/mongodump.exe",
    mongoOutputFolder: "c:/mongodump",
    zipOutputFolder: "c:/mongodumpZip",
    mongodumpParams : { // --out = mongoDumpFolder
        "db": "DbName",
        "username": "Username",
        "password": "Password",
        "authenticationDatabase": "admin",
        // ... all valid params to mongodump can be used
    },
    serverSettings : {
        host: "ssh.myserver.com",
        username: "username",
        password: "password",
        path: "/www/mongo-backup"
    },
    backupName: "dump",
    backupCount: 3, // number of copies to create before the oldest version is replaced
    backupInterval: 24 * 3600 * 1000 // Once a day
};