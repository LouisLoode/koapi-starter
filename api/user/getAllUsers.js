'use strict';

var router = require('koa-joi-router');
var Joi = router.Joi;
var auth = require('../../config/libs/policies.js');
var mongoose = require('mongoose');
var User = mongoose.model('User');
var boom = require ('boom');

var outputFieldsSecurity = 'username email rights avatar cover description location website created';

var getAllUsersHandler = function *(next){
  yield next;
  var error, result;
  try {
    var conditions = {};
    var query = this.request.query;
    // console.log(query);
    // if (query.q) {
    //   conditions = JSON.parse(query.q);
    // }
    var builder = User.find(conditions, outputFieldsSecurity);
    ['limit', 'skip', 'sort'].forEach(function(key){
      // console.log(query[key]);
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

module.exports = {
  method: 'get',
  path: '/users',
  validate: {
     query: {
        limit: Joi.number().max(100),
        skip: Joi.number(),
        q: Joi.string().max(100),
        sort: Joi.string()
      },
     failure: 400,
   },
  // handler: [auth.Jwt, userHndlr.list]
  handler: getAllUsersHandler
};

/**
 * @api {get} /users/ Get all the users
 * @apiName ShowAllUsers
 * @apiGroup Users
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
