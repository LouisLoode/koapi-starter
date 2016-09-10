'use strict';

var path = require('path');
var responseTime = require('koa-response-time');
var logger = require('koa-logger');
var cors = require('koa-cors');
var ip = require('koa-ip');
var session = require('koa-generic-session');

var genres = require('./libs/responses');

module.exports = function(app, config, passport) {
  if (!config.app.keys) { throw new Error('Please add session secret key in the config file!'); }
  app.keys = config.app.keys;

  if (config.app.env !== 'test') {
    app.use(logger());
  }

  app.use(ip({
     whiteList: config.whitelist,
     blackList: config.blacklist
  }));

  app.use(cors());

  app.use(genres());

  app.use(session());

  app.use(passport.initialize());
  app.use(passport.session());


  // app.use(function *(next){
  //   try {
  //     yield next;
  //   } catch (err) {
  //     if (401 == err.status) {
  //       this.status = 401;
  //       this.body = 'Protected resource, use Authorization header to get access\n';
  //     } else {
  //       throw err;
  //     }
  //   }
  // });

  // app.use(bodyParser());
//   app.use (function * (next) {
//   console.log(this.request.body);
// });



  app.use(responseTime());

};
