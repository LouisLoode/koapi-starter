'use strict';

var router = require('koa-joi-router');
var Joi = router.Joi;
var auth = require('../../config/libs/policies.js');
var user = require('../../models/user');
var mongoose = require('mongoose');
var User = mongoose.model('User');
var boom = require ('boom');

var outputFieldsSecurity = 'username email rights pictures informations created';

// Handler
var registerHdlr = function *(next){
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
  handler: registerHdlr
};

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
