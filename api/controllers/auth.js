'use strict';

var router = require('koa-joi-router');
var jwt = require('koa-jwt');
var Joi = router.Joi;

// Handlers
var authHndlr = require('../handlers/auth');

var ctrl = module.exports = {};


ctrl.login = {
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
  handler: authHndlr.login
};
