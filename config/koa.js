'use strict';

var path = require('path');
var responseTime = require('koa-response-time');
var logger = require('koa-logger');
var cors = require('koa-cors');
var session = require('koa-session-redis');
var Grant = require('grant-koa');
var mount = require('koa-mount');

var genres = require('./libs/responses');

module.exports = function(app, config, passport) {
  if (!config.server.keys) { throw new Error('Please add session secret key in the config file!'); }
  app.keys = config.server.keys;

  var grant = new Grant(config);

  if (config.server.env !== 'test') {
    app.use(logger());
  }

  app.use(cors());


  app.use(genres());

  app.use(session({
      store: {
        host: process.env.SESSION_PORT_6379_TCP_ADDR || '127.0.0.1',
        port: process.env.SESSION_PORT_6379_TCP_PORT || 6379,
        ttl: 3600
      }
    }
  ));

  app.use(passport.initialize());

  app.use(mount(grant))

  app.use(responseTime());

};
