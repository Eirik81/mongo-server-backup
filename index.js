/* global require */

var _ = require("lodash");
var spawn = require("child_process").spawn;
var EasyZip = require("easy-zip").EasyZip;
var client = require("scp2");
var settings = require("./settings");
var currentBackupNumber = 0;
var backupInProgress = false;
        
function log(msg) {
    var time = new Date().toISOString();
    console.log(time + ": " + msg);
}
        
function runMongodump(done) {
    var args = [];
    settings.mongodumpParams.out = settings.mongoOutputFolder;
    _.each(settings.mongodumpParams, function (argValue, argName) {
        args.push("--" + argName, argValue);
    });
    const mongodump = spawn(settings.mongodumpPath, args);
   
    mongodump.stderr.on("data", (data) => {
        log(`stderr: ${data}`);
    });

    mongodump.on("close", (code) => {
        if (code === 0) {
            log("Database backed up to " + settings.mongoOutputFolder);
            done();
        } else {
            backupInProgress = false;
        }
    });    
}

function getZipFilename() {
    return settings.backupName + (currentBackupNumber + 1) + ".zip";
}

function getZipLocalFilename() {
    return settings.zipOutputFolder + "/" + getZipFilename();
}

function getZipRemoteFilename() {
    return settings.serverSettings.host + settings.serverSettings.path + "/" + getZipFilename();
}

function createZipFile(done) {
    var zip = new EasyZip();
    zip.zipFolder(settings.mongoOutputFolder, function () {
        zip.writeToFile(getZipLocalFilename());
        log("Backup saved as " + getZipLocalFilename());
        done();
    });
}

function main() {
    if (backupInProgress) {
        log("Backup already in progress! Try setting the backupInterval to a lower value.");
        return;
    }
    backupInProgress = true;
    runMongodump(function () {        
        createZipFile(function () {
            client.scp(getZipLocalFilename(), settings.serverSettings, function (err) {
                if (err) {
                    log(err);
                } else {                    
                    log("Backup uploaded to " + getZipRemoteFilename());
                    currentBackupNumber = (currentBackupNumber + 1) % settings.backupCount;
                }
                backupInProgress = false;
            });
        });
    });        
}

main();
setInterval(main, settings.backupInterval);