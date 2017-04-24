'use strict';

var router = require('koa-joi-router');
var auth = require('../../config/libs/policies.js');
var Joi = router.Joi;

var infos = function *(next){
  yield next;
  var result;
  this.status = 200;
  return this.body = {
    message: 'This came from the api server',
    time: Date.now()
  };
};

module.exports = {
  method: 'get',
  path: '/auth/protected',
  handler: [auth.Jwt, infos]
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
