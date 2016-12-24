'use strict';

var router = require('koa-joi-router');
var boom = require ('boom');
var passport = require('koa-passport');
var Joi = router.Joi;
var mongoose = require('mongoose');
var User = mongoose.model('User');
var utilities = require('../../config/libs/utilities');
var env = process.env.NODE_ENV = process.env.NODE_ENV || 'development';
var config = require('../../config/env/'+env+'.js');


var outputFieldsSecurity = 'username email rights pictures informations created';

// Handler
var loginHandler = function *(next, params, request) {
  var _this = this;
  // console.log(this);
  yield passport.authenticate('local', {session: false}, function*(err, user, info) {
    if (err) {
      throw err;
      // console.log(err);
    }
    if (user === false) {
      _this.status = 401;
      _this.body = 'combo email/password don\'t match any user';
      // return this.body = 'user already exist';
    } else {
      // delete user.updatedAt;
      // delete user.createdAt;
      // delete user.password;
      // delete user.tokens;
      // delete user.apikey;

      yield _this.login(user);
      var token = utilities.createJwt(user);
      _this.status = 200;
      _this.body = { user: user, token: 'JWT ' + token };
    }
  }).call(this);
};

// Controller
module.exports = {
  method: 'post',
  path: '/auth/login',
  validate: {
    body: {
      email: Joi.string().email().required(),
      password: Joi.string().regex(/^[a-zA-Z0-9]{3,30}$/).required()
    },
    type: 'json',
    failure: 400
  },
  handler: loginHandler
};

/**
* @api {post} /auth/login Signin an user
* @apiName Login
* @apiGroup Auth
* @apiVersion 0.0.1
*
* @apiParam {String} email  Email of the user.
* @apiParam {String} password  Password of the user.
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
