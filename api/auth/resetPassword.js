'use strict';

const router = require('koa-joi-router');
const boom = require ('boom');
const passport = require('koa-passport');
const bcrypt = require('bcrypt-promise');
const Joi = router.Joi;
const mongoose = require('mongoose');
const User = mongoose.model('User');
const queue = require('../../config/kue').kue;

const outputFieldsSecurity = 'username email rights pictures informations created';

const findUserByPassTokenHandler = function *(next) {
  const password = this.request.body.password;
  const token = this.params.token;

  try {
    const result = yield User.findOne({resetPasswordToken: token, resetPasswordExpires: { $gt: Date.now() }}, outputFieldsSecurity).exec();
    if (result == null) {
      boom.notFound('missing');
    } else {
      this.user = result;
      yield next;
    }
  } catch (error) {
    boom.notFound('missing');
  }
};

const generatePasswordHandler = function *(next) {
  const password = this.request.body.password;

  try {
      const hash = yield bcrypt.hash(password, 10);
      if (hash === null) {
        this.status = 500;
        this.body = 'Database error'
      } else {
        const data = {
          password: hash,
          resetPasswordExpires: undefined,
          resetPasswordToken: undefined,
        };
        this.data = data;
        yield next;
      }
  } catch(error) {
    this.status = 500;
    this.body = 'error during password encrypt';
  }
};

const savePasswordHandler = function *(next) {
  const user = this.user;

  try {
    const result = yield User.findByIdAndUpdate(user._id, this.data, {new: true}).exec();
    if (result == null) {
      this.status = 500;
      this.body = 'update user error';
    } else {
      this.status = 200;
      this.body = result;
    }
  } catch(error) {
    this.status = 500;
    this.body = 'update user error';
  }
};

// Controller
module.exports = {
  method: 'post',
  path: '/auth/reset-password/:token',
  validate: {
    params: {
      token: Joi.string().required()
    },
    body: {
      password: Joi.string().required()
    },
    type: 'json',
    failure: 400
  },
  handler: [findUserByPassTokenHandler, generatePasswordHandler, savePasswordHandler]
};

/**
* @api {post} /auth/reset-password/:token Define new password for the user with a token
* @apiName ResetPasswordToken
* @apiGroup Auth
* @apiVersion 0.0.1
*
* @apiParam {String} password  New password for the user.
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
*           }
*         }
*/
