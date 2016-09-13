'use strict';

var router = require('koa-joi-router');
var Joi = router.Joi;
var auth = require('../../config/libs/policies.js');
var messages = require('../../models/message');
var mongoose = require('mongoose');
var Message = mongoose.model('Message');
var boom = require ('boom');

var outputFieldsSecurity = 'name content created';

var put = function *(next, params, request){
  yield next;
  var error, result;
  try {
    result = yield Message.findByIdAndUpdate(this.params.id, this.request.body, {new: true}).exec();
    //console.log(result);
    if (result == null) {
      return boom.notFound('missing');
    } else {
      this.status = 200;
      return this.body = result;
    }
  } catch (error) {
      return boom.wrap(error, 400);
  }
};

// Need to fix
module.exports = {
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
  handler: [auth.Jwt, put]
};

/**
* @api {put} /message/:id Update a message
* @apiName UpdateMessage
* @apiGroup Messages
* @apiVersion 0.0.1
*
* @apiParam {String} id  Id of the message.
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
