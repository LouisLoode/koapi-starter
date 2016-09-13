'use strict';

var router = require('koa-joi-router');
var Joi = router.Joi;
var auth = require('../../config/libs/policies.js');
var messages = require('../../models/message');
var mongoose = require('mongoose');
var Message = mongoose.model('Message');
var boom = require ('boom');


var outputFieldsSecurity = 'name content created';


// Handler
var getAllMessageHdlr = function *(next){
  yield next;
  var error, result;
  try {
    var conditions = {};
    var query = this.request.query;
    if (query.q) {
      conditions = JSON.parse(query.q);
    }
    var builder = Message.find(conditions, outputFieldsSecurity);
    ['limit', 'skip', 'sort'].forEach(function(key){
      if (query[key]) {
        builder[key](query[key]);
      }
    })
    result = yield builder.exec();
    return this.body = result;
  } catch (error) {
     boom.wrap(error, 500);
  }
};

// Controller
module.exports = {
  method: 'get',
  path: '/messages',
  handler: [auth.Jwt, getAllMessageHdlr]
};

/**
 * @api {get} /messages/ Get all the messages
 * @apiName ShowAllMessages
 * @apiGroup Messages
 * @apiVersion 0.0.1
 *
 * @apiSuccessExample {json} Success-Response:
 *     HTTP/1.1 200 OK
 *      {
 *        "meta": {
 *          "ok": true,
 *          "code": 200
 *          "version": "1.0.0",
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
 * @apiParamExample {json} Request-Example:
 *     {
 *       "q": {"name":"john"},
 *       "limit": 10,
 *       "skip": 1,
 *       "sort": -created
 *     }
 */
