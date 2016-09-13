'use strict';
var router = require('koa-joi-router');
var recursive = require('recursive-readdir');

var controllers = [];

module.exports = function(app, config, passport) {

  // Init the router
  var general = router();

  // Define a prefix for general router
  general.prefix('/api');

  // Define routes (each file in api), ignore .DS_Store
  recursive('api', ['.DS_Store'], function (err, routes) {
    for (var i = 0; i < routes.length; i++) {
        controllers.push(require('../'+routes[i]));
        general.route(controllers[i]);
        if(config.app.env != 'production'){
          console.log('Registering route: '+routes[i]);
        }
    }
  });

  app.use(general.middleware()); // wired up

};
