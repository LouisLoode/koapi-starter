'use strict';
var user = require('../../models/user');
var utils = require('./utilities');
var User = require('mongoose').model('User');
var co = require('co');
var boom = require('boom');

exports.localUser = function(email, password, done) {
  co(function *() {
    try {
      return yield User.matchUser(email, password);
    } catch (ex) {
      return null;
    }
  }).then(function(user) {
    done(null, user);
  });
};


exports.localUserJWT = function(jwt_payload, done) {
    User.findOne({_id: jwt_payload._doc._id}, function(err, user) {
        if (err) {
            return done(err, false);
        }
        if (user) {
            done(null, user);
        } else {
            done(null, false);
            // or you could create a new account
        }
    });
}

/**
 * OAuth Strategy Overview
 *
 * - User is already logged in.
 *   - Check if there is an existing account with a provider id.
 *     - If there is, return an error message. (Account merging not supported)
 *     - Else link new OAuth account with currently logged-in user.
 * - User is not logged in.
 *   - Check if it's a returning user.
 *     - If returning user, sign in and we are done.
 *     - Else check if there is an existing account with user's email.
 *       - If there is, return an error message.
 *       - Else create a new account.
 */

// exports.localUserApiKey = function(apikey, done) {
//   User.findOne({ apikey: apikey }, function (err, user) {
//     if (err) { return done(err); }
//     if (!user) { return done(null, false); }
//     return done(null, user);
//   });
// }
