'use strict';

var user = require('../../models/user');
var mongoose = require('mongoose');
var User = mongoose.model('User');
var boom = require ('boom');
var router = require('koa-joi-router');
var Joi = router.Joi;
var auth = require('../../config/libs/policies.js');

var outputFieldsSecurity = 'username email rights pictures informations created';

var del = function *(next, params){
  yield next;
  var error, result;
  try {
    result = yield User.remove({ _id: this.params.id }).exec();
    this.status = 200;
    return this.body = result;
  } catch (error) {
    return boom.wrap(error, 400);
  }
};

// Need to fix
module.exports = {
  method: 'delete',
  path: '/user/:id',
  validate: {
    params: {
      id: Joi.string().required()
    },
    failure: 400,
  },
  handler: del
};

/**
 * @api {del} /user/:id Delete an user
 * @apiName DeleteOneUser
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
 *          "ok": 1,
 *          "n": 1
 *        }
 *      }
 *
 */
