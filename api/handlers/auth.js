'use strict';

var user = require('../models/user');
var mongoose = require('mongoose');
var User = mongoose.model('User');
var boom = require ('boom');
var passport = require('koa-passport');
var jwt = require('koa-jwt');
var env = process.env.NODE_ENV = process.env.NODE_ENV || 'development';
var config = require('../../config/env/'+env+'.js');

var hdlr = module.exports = {};

var outputFieldsSecurity = 'username email rights pictures informations created';


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
hdlr.login = function *(next, params, request) {
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
