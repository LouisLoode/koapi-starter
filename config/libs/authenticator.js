'use strict';
var user = require('../../api/models/user');
var User = require('mongoose').model('User');
var co = require('co');

exports.localUser = function(username, password, done) {
  co(function *() {
    try {
      return yield User.matchUser(username, password);
    } catch (ex) {
      // console.log('return null');
      return null;
    }
  }).then(function(user) {
    // console.log(user);
    done(null, user);
  });
};


exports.localUserJWT = function(jwt_payload, done) {
    User.findOne({id: jwt_payload.sub}, function(err, user) {
        if (err) {
            return done(err, false);
        }
        if (user) {
            // console.log(user);
            done(null, user);
        } else {
            done(null, false);
            // or you could create a new account
        }
    });
}

exports.localUserApiKey = function(apikey, done) {
  User.findOne({ apikey: apikey }, function (err, user) {
    if (err) { return done(err); }
    if (!user) { return done(null, false); }
    return done(null, user);
  });
}
