let mongoose = require('mongoose');
let dbConfig = require('../config/dbConfig');
let log = require('../util/log');

// 启动数据库
module.exports = function () {
    return new Promise(function (resolve) {
        let dbUrl = `mongodb://${dbConfig.username}:${dbConfig.password}@${dbConfig.host}:${dbConfig.port}/${dbConfig.dbName}`;
        if (!dbConfig.username) {
            dbUrl = `mongodb://${dbConfig.host}:${dbConfig.port}/${dbConfig.dbName}`;
        }
        mongoose.connect(dbUrl, {
            poolSize: 20
        });
        mongoose.connection.on('connected', function () {
            log.debug(`connect to mongodb success, dbUrl: ${dbUrl}`);
            resolve();
        });

        mongoose.connection.on('error', function (err) {
            log.error(`connect to mongodb error, err: ${err} dbUrl: ${dbUrl}`);
            process.exit(1);
        });

        mongoose.connection.on('disconnected', function (err) {
            log.debug(`disconnect mongodb, dbUrl: ${dbUrl}, reason: ${err}`);
            process.exit(1);
        });
    })
};
