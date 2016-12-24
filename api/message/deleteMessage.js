'use strict';

var router = require('koa-joi-router');
var Joi = router.Joi;
var auth = require('../../config/libs/policies.js');
var messages = require('../../models/message');
var mongoose = require('mongoose');
var Message = mongoose.model('Message');
var boom = require ('boom');

var outputFieldsSecurity = 'name content created';

var deleteMessageHandler = function *(next, params){
  yield next;
  var error, result;
  try {
    result = yield Message.remove({ _id: this.params.id }).exec();
    this.status = 200;
    return this.body = result;
  } catch (error) {
    return boom.wrap(error, 400);
  }
};

// Need to fix
module.exports = {
  method: 'delete',
  path: '/message/:id',
  validate: {
    params: {
      id: Joi.string().required()
    },
    failure: 400,
  },
  handler: [auth.Jwt, deleteMessageHandler]
};

/**
 * @api {del} /message/:id Delete a message
 * @apiName DeleteOneMessage
 * @apiGroup Messages
 * @apiVersion 0.0.1
 *
 * @apiParam {String} id  Id of the message.
 *
 * @apiSuccessExample {json} Success-Response:
 *     HTTP/1.1 200 OK
 *      {
 *        "meta": {
 *          "ok": true,
 *          "code": 200,
 *          "version": "0.0.1",
 *          "now": "2016-05-08T17:04:22.926Z"
 *        },
 *        "data": {
 *          "ok": 1,
 *          "n": 1
 *        }
 *      }
 *
 */
