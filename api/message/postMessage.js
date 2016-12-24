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
var postMessageHandler = function *(next){
  yield next;
  var error, request, result;
  this.request.body.creator = this.req.user._id;
  try {
    var request = new Message(this.request.body);
    result = yield request.save();
    this.status = 200;
    return this.body = result;
  } catch (error) {
    // console.log(error);
    return boom.wrap(error, 400);
  }
};

// Need to fix
module.exports = {
  method: 'post',
  path: '/message',
  validate: {
    body: {
      name: Joi.string().max(100).required(),
      content: Joi.string().required()
    },
    type: 'json'
  },
  handler: [auth.Jwt, postMessageHandler]
};

/**
* @api {post} /message Create a message
* @apiName AddMessage
* @apiGroup Messages
* @apiVersion 0.0.1
*
* @apiParam {String} name  Name of the message.
* @apiParam {String} content  content of the message.
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
*          "__v": 0,
*          "name": "FINALISzeATION",
*          "content": "FINALIzeSATION",
*          "_id": "5731d3fb8d476abe2445b03d",
*          "created": "2016-05-10T12:28:43.482Z"
*        }
*      }
*/
