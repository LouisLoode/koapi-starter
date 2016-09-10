'use strict';

var router = require('koa-joi-router');
var Joi = router.Joi;
var auth = require('../../config/libs/policies.js');

// Handlers
var userHndlr = require('../handlers/user');

var ctrl = module.exports = {};


ctrl.register = {
  method: 'post',
  path: '/auth/register',
  validate: {
    body: {
      username: Joi.string().min(3).max(30).required(),
      email: Joi.string().required(),
      password: Joi.string().regex(/^[a-zA-Z0-9]{3,30}$/).required(),
      password2: Joi.string().regex(/^[a-zA-Z0-9]{3,30}$/).required()
    },
    type: 'json'
  },
  handler: userHndlr.register
};

ctrl.list = {
  method: 'get',
  path: '/users',
  // handler: [auth.Jwt, userHndlr.list]
  handler: userHndlr.list
};

ctrl.get = {
  method: 'get',
  path: '/user/:id',
  validate: {
    params: {
      id: Joi.string().required()
    },
    failure: 400,
  },
  handler: userHndlr.get
};

// Need to fix
ctrl.put = {
  method: 'put',
  path: '/user/:id',
  validate: {
    params: {
      id: Joi.string().required()
    },
    body: {
      username: Joi.string().min(3).max(30),
      email: Joi.string().email(),
      informations: Joi.object().keys({
          description: Joi.string(),
          location: Joi.string(),
          website: Joi.string(),
      })
    },
    type: 'json',
    failure: 400
  },
  // handler: [authMeOrAdmin, userHndlr.put]
  handler: userHndlr.put
};

// Need to fix
ctrl.del = {
  method: 'delete',
  path: '/user/:id',
  validate: {
    params: {
      id: Joi.string().required()
    },
    failure: 400,
  },
  handler: userHndlr.del
};
