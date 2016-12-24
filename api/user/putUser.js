'use strict';

var router = require('koa-joi-router');
var Joi = router.Joi;
var auth = require('../../config/libs/policies.js');
var mongoose = require('mongoose');
var User = mongoose.model('User');
var boom = require ('boom');

var outputFieldsSecurity = 'username email rights avatar cover description location website created';

var putUserHandler = function *(next, params, request){
  yield next;
  var error, result;
    try {
      result = yield User.findByIdAndUpdate(this.req.user._id, this.request.body, {new: true, upsert:true}).exec();
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
  path: '/user',
  validate: {
    body: {
      username: Joi.string().min(3).max(30),
      email: Joi.string().email(),
      informations: Joi.object().keys({
          description: Joi.string(),
          location: Joi.string(),
          website: Joi.string(),
      })
    },
    type: 'json',
    failure: 400
  },
  handler: [auth.Jwt, putUserHandler]
};


 /**
 * @api {put} /user/:id Update an user
 * @apiName UpdateUser
 * @apiGroup Users
 * @apiVersion 0.0.1
 *
 * @apiParam {String} id  Id of the User.
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
