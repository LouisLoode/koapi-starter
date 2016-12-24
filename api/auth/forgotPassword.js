'use strict';

var router = require('koa-joi-router');
var boom = require ('boom');
var passport = require('koa-passport');
var Joi = router.Joi;
var mongoose = require('mongoose');
var User = mongoose.model('User');
var queue = require('../../config/kue').kue;

var env = process.env.NODE_ENV = process.env.NODE_ENV || 'development';
var config = require('../../config/env/'+env+'.js');

var utils = require('../../config/libs/utilities');

var outputFieldsSecurity = 'username email rights pictures informations created';

// Handler
var findLocalUserByEmailHandler = function *(next) {
  var error, user, result;

  const email = this.request.body.email;

  try {
    user = yield User.findOne({ email: email }).exec();
    if (user == null) {
      boom.notFound('missing');
    } else {
      this.user = user;
      yield next;
    }
  } catch (error) {
    boom.badRequest('invalid query');
  }
};

// Handler
var updateUserHandler = function *(next) {
  const user = this.user;
  const email = user.email;
  const resetToken = utils.randomString(32);
  // const resetToken = 'kikoo';
  const request = {resetPasswordToken : resetToken, resetPasswordExpires : Date.now() + 3600000};
  try{
    const result = User.findByIdAndUpdate(user.id, request, {new: true}).exec();
    if (result == null) {
      return boom.notFound('missing');
    } else {
      var html = utils.emailHTML('Restore your password','Hello '+user.username+' ! <br><br> Your reset token:<br> <center><a href="'+config.front.url+'/reset-password/'+resetToken+'" target="_blank">'+config.front.url+'/reset-password/'+resetToken+'</a></center>');
      var data = {
        to: user.email,
        subject: 'Restore your password',
        text: 'Hello '+user.username+' ! \n '+user.email+' \n token : '+resetToken+' \n url: '+config.front.url+'/reset-password/'+resetToken+'',
        html: html
      };
      queue.create('email', data).priority('high').attempts(3).save();

      yield next;
    }
  } catch (error) {
    boom.badRequest('invalid query');
  }
};

var sendForgotEmailHandler = function *(next) {
  this.status = 200;
  this.body = 'you should receive an email';
};

// Controller
module.exports = {
  method: 'post',
  path: '/auth/forgot-password',
  validate: {
    body: {
      email: Joi.string().email().required()
    },
    type: 'json',
    failure: 400
  },
  handler: [findLocalUserByEmailHandler, updateUserHandler, sendForgotEmailHandler]
};

/**
* @api {post} /auth/forgot-password Define new password for the user
* @apiName ForgotPassword
* @apiGroup Auth
* @apiVersion 0.0.1
*
* @apiParam {String} email  Email of the user.
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
*        "data": "you should receive an email"
*      }
*/
