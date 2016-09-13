'use strict';

var path = require('path');
var responseTime = require('koa-response-time');
var logger = require('koa-logger');
var cors = require('koa-cors');
var session = require('koa-generic-session');

var genres = require('./libs/responses');

module.exports = function(app, config, passport) {
  if (!config.app.keys) { throw new Error('Please add session secret key in the config file!'); }
  app.keys = config.app.keys;

  if (config.app.env !== 'test') {
    app.use(logger());
  }

  app.use(cors());

  app.use(genres());

  app.use(session());

  app.use(passport.initialize());
  
  app.use(passport.session());

  app.use(responseTime());

};
