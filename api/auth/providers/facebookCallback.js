'use strict';

var router = require('koa-joi-router');
var boom = require ('boom');
var passport = require('koa-passport');
var Joi = router.Joi;
var mongoose = require('mongoose');
var User = mongoose.model('User');
var utils = require('../../../config/libs/utilities')
var request = require('koa-request');
var utilities = require('../../../config/libs/utilities');

var outputFieldsSecurity = 'username email rights pictures informations created';

 /**
 * OAuth Strategy Overview
 *
 *   - Check if it's a returning user.
 *     - If returning user, sign in and we are done.
 *     - Else check if there is an existing account with user's email.
 *       - If there is, return an error message.
 *       - Else create a new account.
 */

var getUserOnFBHandler = function *(next){
  const token = this.query.access_token;

  var options = {
    method: 'GET',
    url: 'https://graph.facebook.com/v2.8/me',
    headers: {
      'content-type': 'application/json'
    },
    qs: {
      access_token: token,
      fields: 'id,first_name,last_name,email,birthday,gender,timezone,locale,location'
    }
  };

  try {
    let response = yield request(options); //Yay, HTTP requests with no callbacks!
    if (response.body == null) {
      this.status = 400;
      this.body = 'There is no valid user on Facebook';
    } else {
      this.user = { facebook : JSON.parse(response.body) };
      yield next;
    }
  } catch (error) {
    this.status = 400;
    this.body = 'There is one error with the facebook request';
  }
}

var getLocalUserHandler = function *(next){
  const facebookUser = this.user.facebook;
  try {
    let result = yield User.findOne({ 'connections.facebook': facebookUser.id });
    if (result == null) {
      yield next;
    } else {
      console.log(result);
      yield this.login(result);
      var jwt = utils.createJwt(result);
      this.status = 200;
      this.body = { user: result, token: 'JWT ' + jwt };
    }
  } catch (error) {
    boom.notFound('missing');
  }
}

var getLocalUserByEmailHandler = function *(next){
  try {
    let result = yield User.findOne({ 'email': this.user.facebook.email});
    if (result == null) {
      yield next;
    } else {
      this.status = 400;
      this.body = 'There is already a Facebook account that belongs to you. Sign in with that account or delete it, then link it with your current account.';
    }
  } catch (error) {
    boom.notFound('missing');
  }
}

var callbackHandler = function *(next){
  const token = this.query.access_token;
  try {
    var password = utils.randomString(10);
    const user = new User();
    user.email = this.user.facebook.email;
    user.password = password;
    user.password2 = password;
    user.connections.facebook = this.user.facebook.id;
    user.connectionsTokens.push({ kind: 'facebook', token });
    user.username = `${this.user.facebook.first_name} ${this.user.facebook.last_name}`;
    user.infos.gender = this.user.facebook.gender;
    user.pictures.avatar = `https://graph.facebook.com/${this.user.facebook.id}/picture?type=large`;
    // user.pictures.cover = `https://graph.facebook.com/${profile.id}/picture?type=large`;
    user.infos.location = (this.user.facebook.location) ? this.user.facebook.location.name : null;

    let result = yield user.save();
    yield this.login(result);
    var jwt = utils.createJwt(result);

    this.status = 200;
    this.body = { user: result, token: 'JWT ' + jwt };
  } catch (error) {
    this.status = 400;
    return this.body = 'username not available';
  }
}


// Controller
module.exports = {
  method: 'get',
  path: '/auth/handle_facebook',
  validate: {
    // query: {
    //   access_token: Joi.string().token()
    // },
    failure: 400
  },
  handler: [getUserOnFBHandler, getLocalUserHandler, getLocalUserByEmailHandler, callbackHandler]
};

/**
* @api {get} /auth/handle_facebook Callback auth Facebook
* @apiName LoginFacebookCallback
* @apiGroup Auth
* @apiVersion 0.0.1
*
* @apiSuccessExample {json} Success-Response:
*     HTTP/1.1 200 OK
*      {
*        "meta": {
*          "ok": true,
*          "code": 200,
*          "version": "0.0.1",
*          "now": "2016-05-10T12:28:43.502Z"
*        },
*        "data": {
*          "username": "FINALISzeATION",
*          "email": "FINALIzeSATION",
*          "apikey": "[APIKEY]",
*          "token": "[TOKEN]",
*          "...": "...",
*          "id": "5731d3fb8d476abe2445b03d",
*          "created": "2016-05-10T12:28:43.482Z"
*        }
*      }
*/
