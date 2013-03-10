#!/usr/bin/env node
/**
 * Generate test mails.
 * json files put to the directory app/mails
 */

(function() {
    var fs = require('fs');
    var jg = require('../lib/generate-json.js');
    var config = require('../config/mail-generator.conf.json');
    var json = jg.generateJson(config);
    var DIR_MAILS = 'app/mails';

    var deleteFolderRecursive = function(path) {
        var files = [];
        if (fs.existsSync(path)) {
            files = fs.readdirSync(path);
            files.forEach(function(file) {
                var curPath = path + "/" + file;
                if (fs.statSync(curPath).isDirectory()) { // recurse
                    deleteFolderRecursive(curPath);
                } else { // delete file
                    fs.unlinkSync(curPath);
                }
            });
            fs.rmdirSync(path);
        }
    };

    deleteFolderRecursive(DIR_MAILS);

    // create directory 'mails'
    fs.mkdirSync(DIR_MAILS);

    fs.writeFile(DIR_MAILS + '/messages.json', JSON.stringify(json.result));

    // create json files
    json.result.forEach(function(mail) {
        fs.writeFile(DIR_MAILS + '/' + mail.id + '.json', JSON.stringify(mail));
    });

}(this));
