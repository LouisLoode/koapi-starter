'use strict';

var user = require('../models/user');
var mongoose = require('mongoose');
var User = mongoose.model('User');
var boom = require ('boom');

var hdlr = module.exports = {};

var outputFieldsSecurity = 'username email rights pictures informations created';

/**
* @api {post} /auth/register Create an user
* @apiName AddUser
* @apiGroup Users
* @apiVersion 0.0.1
*
* @apiParam {String} username  Username of the user.
* @apiParam {String} email  Email of the user.
* @apiParam {String} password  Password of the user.
* @apiParam {String} password2  Password checking for registering.
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
*          "username": "FINALISzeATION",
*          "email": "FINALIzeSATION",
*          "...": "...",
*          "_id": "5731d3fb8d476abe2445b03d",
*          "created": "2016-05-10T12:28:43.482Z"
*        }
*      }
*/
hdlr.register = function *(next){
 yield next;
 var error, data, request, result;
 // console.log(this.request.body);
 var data = this.request.body;
 if(data.password === data.password2){
   try {
     var request = new User(data);
     result = yield request.save();
     this.status = 200;
     return this.body = result;
   } catch (error) {
     return boom.wrap(error, 400);
   }
 }else{
   this.status = 400;
   return this.body = 'differents passwords';
 }
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
hdlr.list = function *(next){
  yield next;
  var error, result;
  try {
    var conditions = {};
    var query = this.request.query;
    if (query.q) {
      conditions = JSON.parse(query.q);
    }
    var builder = User.find(conditions, outputFieldsSecurity);
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
hdlr.get = function *(next, params) {
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
hdlr.put = function *(next, params, request){
  yield next;
  var error, result;
  try {
    result = yield User.findByIdAndUpdate(this.params.id, this.request.body, {new: true}).exec();
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
hdlr.del = function *(next, params){
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
