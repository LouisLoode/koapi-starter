'use strict';

var LocalStrategy = require('passport-local').Strategy;
var LocalAPIKeyStrategy = require('passport-localapikey').Strategy;
var JwtStrategy = require('passport-jwt').Strategy,
    ExtractJwt = require('passport-jwt').ExtractJwt;
// var Strategy = require('passport-http-bearer').Strategy;
var authenticator = require('./libs/authenticator');
var user = require('../api/models/user');
var User = require('mongoose').model('User');

var opts = {}
opts.jwtFromRequest = ExtractJwt.fromAuthHeader();


var serialize = function(user, done) {
  // console.log(user);
  done(null, user._id);
};

var deserialize = function(id, done) {
  // console.log(id);
  User.findById(id, done);
};



module.exports = function(passport, config) {
  passport.serializeUser(serialize);
  passport.deserializeUser(deserialize);

  opts.secretOrKey = config.app.secret;
  passport.use(new LocalAPIKeyStrategy(authenticator.localUserApiKey));
  passport.use(new JwtStrategy(opts, authenticator.localUserJWT));
  passport.use(new LocalStrategy(authenticator.localUser));
  // passport.use(new Strategy(authenticator.localUserJWT));
};
