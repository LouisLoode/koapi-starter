'use strict';
var router = require('koa-joi-router');
var recursive = require('recursive-readdir');


var controllers = [];
// ignore files named 'foo.cs' or files that end in '.html'.
recursive('api', ['.DS_Store', '*.html'], function (err, routes) {
  // Files is an array of filename
  console.log(routes);
  for (var i = 0; i < routes.length; i++) {
      // text += cars[i] + "<br>";
      controllers.push(require('../'+routes[i]));
  }
});

var messageCntrlGetAll = require('../api/message/getall');
var messageCntrlGetOne = require('../api/message/getone');
var messageCntrlPost = require('../api/message/post');
var messageCntrlPut = require('../api/message/put');
var messageCntrlDelete = require('../api/message/delete');

var userCntrlGetAll = require('../api/user/getall');
var userCntrlGetOne = require('../api/user/getone');
var userCntrlPut = require('../api/user/put');
var userCntrlDelete = require('../api/user/delete');

var authCntrl = require('../api/auth/login');
var registerCntrl = require('../api/auth/register');


module.exports = function(app, config, passport) {

  // Init the router
  var general = router();

  // var routes = require('include-all')({
  //     dirname     :  '/jobs',
  //     filter      :  /(.+)\.js$/,
  //     excludeDirs :  /^\.(git|svn)$/,
  //     optional    :  true
  // });
  //
  // console.log(routes);
  //
  // _.forEach(routes, function(route, name){
  //     console.log('registering handler: '+name);
  //     console.log(route);
  // })


  // Define a prefix for general router
  general.prefix('/api');

  // Define routes
  general.route(messageCntrlGetAll);
  general.route(messageCntrlGetOne);
  general.route(messageCntrlPost);
  general.route(messageCntrlPut);
  general.route(messageCntrlDelete);

  // // Define user routes
  general.route(registerCntrl);
  general.route(userCntrlGetAll);
  general.route(userCntrlGetOne);
  general.route(userCntrlPut);
  general.route(userCntrlDelete);


  // Define auth routes
  general.route(authCntrl);

  app.use(general.middleware()); // wired up

};
