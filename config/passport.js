'use strict';

var LocalStrategy = require('passport-local').Strategy;
var mongoose = require('mongoose');
// var LocalAPIKeyStrategy = require('passport-localapikey').Strategy;

var JwtStrategy = require('passport-jwt').Strategy,
    ExtractJwt = require('passport-jwt').ExtractJwt;
var authenticator = require('./libs/authenticator');
var user = require('../models/user');
var User = require('mongoose').model('User');

var opts = {}
opts.jwtFromRequest = ExtractJwt.fromAuthHeader();


var serialize = function(user, done) {
  // console.log(user._id);
  if(user._id === undefined){
    var result = user.id;
  } else {
    var result = user._id;
  }
  // done(null, user);
  done(null, result );
};

var deserialize = function(id, done) {
  if (mongoose.Types.ObjectId.isValid(id)) {
    User.findById(id, done);
  } else if (id.hasOwnProperty('id')) {
    User.findById(id.id, done);
  }
  else {
    console.log('non');
    console.log(id);
  }
};

module.exports = function(passport, config) {
  passport.serializeUser(serialize);
  passport.deserializeUser(deserialize);

  opts.secretOrKey = config.server.secret;
  passport.use(new JwtStrategy(opts, authenticator.localUserJWT));
  passport.use(new LocalStrategy({usernameField: 'email', session: false}, authenticator.localUser));
};
