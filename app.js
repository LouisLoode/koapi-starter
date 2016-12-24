'use strict';

/**
 * DEPENDENCIES
 */
const koa = require('koa');
const mongoose = require('mongoose');
const passport = require('koa-passport');
const _ = require('lodash');

const app = module.exports = koa();

/**
 * CONFIGURATION
 */
var env = process.env.NODE_ENV = process.env.NODE_ENV || 'development';
const config = require('./config/env/'+env);
config.server.env = env;

// Connexion to mongoose
mongoose.Promise = global.Promise;
if(config.server.env === 'production'){
  mongoose.connect('mongodb://' + config.db.mongo.user + ':' + config.db.mongo.pass + '@' + config.db.mongo.host + ':' + config.db.mongo.port + '/' + config.db.mongo.database);
}else{
  mongoose.connect('mongodb://' + config.db.mongo.host + ':' + config.db.mongo.port + '/' + config.db.mongo.database);
}

mongoose.connection.on('error', function(err) {
  console.log(err);
});

// Passport config
require('./config/passport')(passport, config);


// Koa configuration
require('./config/koa')(app, config, passport);

/*
*
* ROUTER
*
*/
require('./config/routes')(app, config, passport);

// Start app
if (!module.parent) {
  app.listen(config.server.port);
  console.log('Server started, listening on port: ' + config.server.port);
}

console.log('Environment: ' + config.server.env);
