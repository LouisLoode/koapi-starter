'use strict';

var messages = require('../models/message');
var mongoose = require('mongoose');
var Message = mongoose.model('Message');
var boom = require ('boom');

var hdlr = module.exports = {};

var outputFieldsSecurity = 'name content created';


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
hdlr.list = function *(next){
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
hdlr.get = function *(next, params) {
  yield next;
  var error, result;
  try {
    //console.log(this.params.id);
    result = yield Message.findOne({ '_id': this.params.id}, outputFieldsSecurity).exec();
    //console.log(result);
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
hdlr.post = function *(next){
  yield next;
  var error, request, result;
  // passport.serialize
  // console.log(request);
  // console.log(this.req.user);
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
hdlr.put = function *(next, params, request){
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
hdlr.del = function *(next, params){
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
