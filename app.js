'use strict';

/**
 * DEPENDENCIES
 */
const koa = require('koa');
const mongoose = require('mongoose');
const passport = require('koa-passport');
const _ = require('lodash');

var app = module.exports = koa();

/**
 * CONFIGURATION
 */
var env = process.env.NODE_ENV = process.env.NODE_ENV || 'development';
var config = require('./config/env/'+env);
config.app.env = env;

// Connexion to mongoose
//mongoose.connect('mongodb://' + config.db.mongo.user + ':' + config.db.mongo.pass + '@' + config.db.mongo.host + ':' + config.db.mongo.port + '/' + config.db.mongo.database);
mongoose.connect('mongodb://' + config.db.mongo.host + ':' + config.db.mongo.port + '/' + config.db.mongo.database);
mongoose.connection.on('error', function(err) {
  console.log(err);
});

var models = require('include-all')({
    dirname     :  __dirname +'/models',
    filter      :  /(.+)\.js$/,
    excludeDirs :  /^\.(git|svn)$/,
    optional    :  true
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
  app.listen(config.app.port);
  console.log('Server started, listening on port: ' + config.app.port);
}

console.log('Environment: ' + config.app.env);

_.forEach(models, function(model, name){
    console.log('registering model: '+name);
    // require('./models/' + model);
})
