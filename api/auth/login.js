'use strict';

var router = require('koa-joi-router');
var boom = require ('boom');
var passport = require('koa-passport');
var jwt = require('koa-jwt');
var Joi = router.Joi;
var user = require('../../models/user');
var mongoose = require('mongoose');
var User = mongoose.model('User');

var env = process.env.NODE_ENV = process.env.NODE_ENV || 'development';
var config = require('../../config/env/'+env+'.js');


var outputFieldsSecurity = 'username email rights pictures informations created';

// Handler
var loginHdlr = function *(next, params, request) {
  var _this = this;
  // console.log(this);
  yield* passport.authenticate('local',{session: false}, function*(err, user, info) {
    if (err) {
      throw err;
      // console.log(err);
    }
    // console.log(user);
    if (user === false) {
      _this.status = 401;
    } else {
      yield _this.login(user);
      var token = jwt.sign(user, config.app.secret, {
              expiresIn: 10080 // in seconds
            });
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
      username: Joi.string().min(3).max(30).required(),
      password: Joi.string().regex(/^[a-zA-Z0-9]{3,30}$/).required()
    },
    type: 'json',
    failure: 400
  },
  handler: loginHdlr
};

/**
* @api {post} /auth/register Create an user
* @apiName AddUser
* @apiGroup Users
* @apiVersion 0.0.1
*
* @apiParam {String} username  Username of the user.
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
