'use strict';

const router = require('koa-joi-router');
const Joi = router.Joi;
const mongoose = require('mongoose');
const boom = require('boom');
const User = mongoose.model('User');
const auth = require('../../config/libs/policies.js');

// Handler
const getOneUserHandler = function *(next) {
  try {
    const result = yield User.findOne({ '_id': this.params.id}).exec();
    if (result == null) {
      boom.notFound('missing');
    } else {
      this.user = result;
      yield next;
    }
  } catch (error) {
    boom.notFound('missing');
  }
};

const followHandler = function *(next){
  const selfUser = this.req.user;
  const userToFollow = this.user;
    if (selfUser.following.indexOf(userToFollow._id) === -1 || userToFollow.followers.indexOf(selfUser._id) === -1) {
      console.log('Follow user');
      userToFollow.followers.push(selfUser._id);
      selfUser.following.push(userToFollow._id);
    } else {
      console.log('Unfollow user');
      userToFollow.followers.splice(userToFollow.followers.indexOf(selfUser._id), 1);
      selfUser.following.splice(selfUser.following.indexOf(userToFollow._id), 1);
    }

    try {
      yield selfUser.save();
      yield userToFollow.save();
      this.status = 200;
      this.body = 'update follow status done';
    } catch(error){
      // console.log(error);
      this.status = 400;
      this.body = 'follow request error';
    }
}

// Controller
module.exports = {
  method: 'post',
  path: '/user/follow/:id',
  handler: [auth.Jwt, getOneUserHandler, followHandler]
};

/**
* @api {post} /user/follow/:id Follow of Unfollow and user
* @apiName FollowUnfollow
* @apiGroup User
* @apiVersion 0.0.1
*
* @apiParam {String} id  Id of the user to follow or to unfollow
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
