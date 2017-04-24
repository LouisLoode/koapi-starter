'use strict';

var kue = require('kue');
var env = process.env.NODE_ENV = process.env.NODE_ENV || 'development';
var config = require('./env/'+env+'.js');

var q = kue.createQueue({
        prefix: 'q',
        redis: {
            // host: config.redis.host,
            host: config.db.redis.host,
            port: config.db.redis.port,
            database: config.db.redis.database,
            auth: config.db.redis.auth,
        }
    });

module.exports.kue = q;
