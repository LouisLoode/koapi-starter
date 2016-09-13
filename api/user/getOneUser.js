'use strict';

var router = require('koa-joi-router');
var Joi = router.Joi;
var auth = require('../../config/libs/policies.js');
var user = require('../../models/user');
var mongoose = require('mongoose');
var User = mongoose.model('User');
var boom = require ('boom');

var outputFieldsSecurity = 'username email rights pictures informations created';

var get = function *(next, params) {
  yield next;
  var error, result;
  try {
    //console.log(this.params.id);
    result = yield User.findOne({ '_id': this.params.id}, outputFieldsSecurity).exec();
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

module.exports = {
  method: 'get',
  path: '/user/:id',
  validate: {
    params: {
      id: Joi.string().required()
    },
    failure: 400,
  },
  handler: get
};



/**
 * @api {get} /user/:id Get an user
 * @apiName ShowOneUser
 * @apiGroup Users
 * @apiVersion 0.0.1
 *
 * @apiParam {String} id  Id of the user.
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
