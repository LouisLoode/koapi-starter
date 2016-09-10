'use strict';

var router = require('koa-joi-router');

// Controllers
var messageCntrl = require('../api/controllers/message');
var userCntrl = require('../api/controllers/user');
var authCntrl = require('../api/controllers/auth');


module.exports = function(app, config, passport) {

  // Init the router
  var general = router();


  // Define a prefix for general router
  general.prefix('/api');

  // Define routes
  general.route(messageCntrl.list);
  general.route(messageCntrl.get);
  general.route(messageCntrl.post);
  general.route(messageCntrl.put);
  general.route(messageCntrl.del);

  // Define user routes
  general.route(userCntrl.register);
  general.route(userCntrl.list);
  general.route(userCntrl.get);
  general.route(userCntrl.put);
  general.route(userCntrl.del);


  // Define auth routes
  general.route(authCntrl.login);

  app.use(general.middleware()); // wired up

};
