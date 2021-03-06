# mongo-server-backup
This node module performs scheduled backups of mongodb to an ftp server.
The backup is done using the mongodump utility included in mongodb.
The dump folder is zipped and uploaded to the ftp server.

## Installation and configuration

Create a settings.js file to configure the module. The settings-example.js shows how the settings are structured:
```javascript
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
``` 
Install and start the module:
```console
npm install
node index.js
```