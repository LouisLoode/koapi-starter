'use strict';

var router = require('koa-joi-router');
var Joi = router.Joi;
var mongoose = require('mongoose');
var User = mongoose.model('User');
// var boom = require ('boom');

var outputFieldsSecurity = 'username email rights pictures informations created';

// Handler
var registerHandler = function *(next){
 yield next;
 var error, data, request, result;
 var data = this.request.body;
 if(data.password === data.password2){
   try {
     var request = new User(data);
     result = yield request.save();
     this.status = 200;
    //  console.log(result);
     return this.body = result;
   } catch (error) {
     this.status = 400;
     return this.body = 'user already exist';
   }
 }else{
   this.status = 400;
   return this.body = 'differents passwords';
 }
};

// Controller
module.exports = {
  method: 'post',
  path: '/auth/register',
  validate: {
    body: {
      username: Joi.string().min(3).max(30).required(),
      email: Joi.string().required(),
      password: Joi.string().regex(/^[a-zA-Z0-9]{3,30}$/).required(),
      password2: Joi.string().regex(/^[a-zA-Z0-9]{3,30}$/).required()
    },
    type: 'json'
  },
  handler: registerHandler
};

/**
* @api {post} /auth/register Create an user
* @apiName Register
* @apiGroup Auth
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
