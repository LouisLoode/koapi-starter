'use strict';

var router = require('koa-joi-router');
var Joi = router.Joi;
var auth = require('../../config/libs/policies.js');
var messages = require('../../models/message');
var mongoose = require('mongoose');
var Message = mongoose.model('Message');
var boom = require ('boom');

var outputFieldsSecurity = 'name content created';

var getOneMessageHandler = function *(next, params) {
  yield next;
  var error, result;
  try {
    result = yield Message.findOne({ '_id': this.params.id}, outputFieldsSecurity).exec();
    if (result == null) {
      boom.notFound('missing');
    } else {
      this.status = 200;
      return this.body = result;
    }
  } catch (error) {
    boom.notFound('missing');
  }
};


module.exports = {
  method: 'get',
  path: '/message/:id',
  validate: {
    params: {
      id: Joi.string().required()
    },
    failure: 400,
  },
  handler: [auth.Jwt, getOneMessageHandler]
};

/**
 * @api {get} /message/:id Get a message
 * @apiName ShowOneMessage
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
 *          "__v": 0,
 *          "name": "This is my message name",
 *          "content": "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vivamus eu massa leo. Aenean nec orci vel orci rutrum viverra id ac massa. Nullam vitae faucibus nulla. Mauris vitae mi mattis, sagittis turpis at, dignissim arcu.",
 *          "_id": "572f7196e002358e0e7e5c91",
 *          "created": "2016-05-08T17:04:22.923Z"
 *        }
 *      }
 *
 * @apiErrorExample {json} Error-Response
 *     HTTP/1.1 404 Not Found
 *      {
 *        "meta": {
 *          "ok": false,
 *          "code": 404,
 *          "message": "Not found",
 *          "version": "0.0.1",
 *          "now": "2016-05-08T17:04:22.926Z"
 *        }
 *      }
 *
 */
