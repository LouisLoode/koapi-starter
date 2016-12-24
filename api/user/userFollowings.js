'use strict';

const router = require('koa-joi-router');
const Joi = router.Joi;
const mongoose = require('mongoose');
const boom = require('boom');
const User = mongoose.model('User');

// Handler
const getOneUserHandler = function *(next) {
  try {
    const result = yield User.findOne({ '_id': this.params.id}).exec();
    if (result == null) {
      boom.notFound('missing');
    } else {
      console.log(result);
      this.user = result;
      yield next;
    }
  } catch (error) {
    console.log(error);
    boom.notFound('missing');
  }
};

const followingHandler = function *(next){
  const user = this.user;
  const following = user.following;

    try {
      let userFollowing = yield User.find({_id: {$in: following}})
                                .populate('user', '_id name username')
                                .exec();
      if (userFollowing == null) {
        boom.notFound('missing');
      } else {
        this.status = 200;
        this.body = userFollowing;
      }
    } catch(error){
      console.log(error);
      this.status = 400;
      this.body = 'following request error';
    }
}

// Controller
module.exports = {
  method: 'get',
  path: '/user/:id/following',
  handler: [getOneUserHandler, followingHandler]
  // handler: followersHandler
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
