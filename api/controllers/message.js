'use strict';

var router = require('koa-joi-router');
var Joi = router.Joi;
var auth = require('../../config/libs/policies.js');

// Handlers
var messageHndlr = require('../handlers/message');

var ctrl = module.exports = {};

ctrl.list = {
  method: 'get',
  path: '/messages',
  handler: [auth.Jwt, messageHndlr.list]
};

ctrl.get = {
  method: 'get',
  path: '/message/:id',
  validate: {
    params: {
      id: Joi.string().required()
    },
    failure: 400,
  },
  handler: [auth.Jwt, messageHndlr.get]
};

// Need to fix
ctrl.post = {
  method: 'post',
  path: '/message',
  validate: {
    body: {
      name: Joi.string().max(100).required(),
      content: Joi.string().required()
    },
    type: 'json'
  },
  handler: [auth.Jwt, messageHndlr.post]
};

// Need to fix
ctrl.put = {
  method: 'put',
  path: '/message/:id',
  validate: {
    params: {
      id: Joi.string().required()
    },
    body: {
      name: Joi.string().max(100).required(),
      content: Joi.string().required()
    },
    type: 'json',
    failure: 400
  },
  handler: [auth.Mine, messageHndlr.put]
};

// Need to fix
ctrl.del = {
  method: 'delete',
  path: '/message/:id',
  validate: {
    params: {
      id: Joi.string().required()
    },
    failure: 400,
  },
  handler: [auth.Jwt, messageHndlr.del]
};
