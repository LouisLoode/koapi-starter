'use strict';

var router = require('koa-joi-router');
var passport = require('koa-passport');
var Joi = router.Joi;
var co = require('co')
var q = require('q');
var utils = require('../../../config/libs/utilities')
var mongoose = require('mongoose');
var User = mongoose.model('User');

// Handler
var handlerFct1 = function *(next) {
    console.log('fct1');

    try {
      // console.log(this.req.user);
      // console.log(this.params.id);
      this.user = yield User.findOne({ 'email': 'louisdebraine@dealerdesons.com'});
      console.log(this.user);
      if (this.user == null) {
        this.status = 400;
        this.body = 'missing';
      } else {
        console.log('fct 1 ok');
        yield next;
        console.log('fct 1 ok after yield next');
      }
    } catch (error) {
      // boom.notFound('missing');
      this.status = 400;
      this.body = 'missing';
    }

};

var handlerFct2 = function *(next) {
  yield next;
    console.log('fct2');
    // console.log(this.user);
    this.body = this.user;
    // yield next;
};



/**
 * OAuth Strategy Overview
 *
 * - User is already logged in.
 *   - Check if there is an existing account with a provider id.
 *     - If there is, return an error message. (Account merging not supported)
 *     - Else link new OAuth account with currently logged-in user.
**/

//
//
//   // if (req.user) {
//   //   console.log(profile.id);
//   //   User.findOne({ 'social.facebook': profile.id }, function(err, existingUser) {
//   //     // console.log(existingUser);
//   //     if (err) { return done(err); }
//   //     if (existingUser) {
//   //       console.log('Cas 1.2');
//   //       console.log('Ca fonctionne !');
//   //       // boom.badRequest('There is already a Facebook account that belongs to you. Sign in with that account or delete it, then link it with your current account.');
//   //       // var mess = 'There is already a Facebook account that belongs to you. Sign in with that account or delete it, then link it with your current account.';
//   //       done(err);
//   //     } else {
//   //       console.log('Cas 1.3');
//   //       console.log('req.user.id :');
//   //       console.log(req.user.id);
//   //       User.findById(req.user.id, function(err, user) {
//   //         console.log('Cas 1.3.1');
//   //         if (err) { return done(err); }
//   //         user.social.facebook = profile.id;
//   //         user.tokens.push({ kind: 'facebook', accessToken });
//   //         user.username = user.profile.name || `${profile.name.givenName} ${profile.name.familyName}`;
//   //         user.infos.gender = user.profile.gender || profile._json.gender;
//   //         user.pictures.avatar = user.profile.picture || `https://graph.facebook.com/${profile.id}/picture?type=large`;
//   //         user.save(function(err){
//   //           console.log('Cas 1.3.2');
//   //           // req.flash('info', { msg: 'Facebook account has been linked.' });
//   //           done(err, user);
//   //         });
//   //       });
//   //     }
//   //   });
//   // } else {
//     console.log('Cas 2');
//     console.log('profile.id :'+profile.id);
//     User.findOne({ 'social.facebook': profile.id }, function(err, existingUser) {
//       if (err) {
//         console.log(err);
//         _this.status = 400;
//         return _this.body = err;
//         // return done(err);
//       }
//       if (existingUser) {
//         console.log('Cas 2.1');
//         // return done(null, existingUser);
//         console.log(existingUser);
//         // _this.body
//         // return existingUser;
//         _this.code = 200;
//         return _this.body = existingUser;
//
//
//       }
//       console.log('Cas 2.2');
//       console.log('profile._json.email :');
//       console.log(profile._json.email);
//       User.findOne({ email: profile._json.email }, function(err, existingEmailUser) {
//         console.log('Cas 2.3');
//         if (err) {
//           console.log(err);
//           // this.status = 400;
//           // return this.body = err;
//           boom.badRequest(err);
//         }
//         if (existingEmailUser) {
//           console.log('Cas 2.4');
//           boom.badRequest('There is already an account using this email address. Sign in to that account and link it with Facebook manually from Account Settings.');
//         } else {
//           console.log('Cas 2.5');
//           console.log('ça fonctionne');
//           var password = utils.randomString(10);
//           const user = new User();
//           user.email = profile._json.email;
//           user.password = password;
//           user.password2 = password;
//           user.social.facebook = profile.id;
//           user.tokens.push({ kind: 'facebook', accessToken });
//           user.username = `${profile.name.givenName} ${profile.name.familyName}`;
//           user.infos.gender = profile._json.gender;
//           user.pictures.avatar = `https://graph.facebook.com/${profile.id}/picture?type=large`;
//           // user.pictures.cover = `https://graph.facebook.com/${profile.id}/picture?type=large`;
//           user.infos.location = (profile._json.location) ? profile._json.location.name : null;
//
//           user.save(function(err, result) {
//             // this.body = result;
//             // console.log({ id: result._id, username: result.username });
//             // return done(null, result);
//             _this.status = 200;
//             return _this.body = result;
//           });
//         }
//       });
//     });
//   // }

// Controller
module.exports = {
  method: 'get',
  path: '/test',
  validate: {
    failure: 400
  },
  handler: [ handlerFct1, handlerFct2 ]
};
