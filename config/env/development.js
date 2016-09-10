'use strict';

var path = require('path');
var _ = require('lodash');

var specific = {
    app: {
      url: 'http://localhost:3000',
      port: 3000,
      name: 'Starter Koa - Dev',
      keys: [ 'super-secret', 'super-secret2' ],
      secret: 'secret for JWT'
    },
    db: {
      mongo: {
        user: '',
        pass: '',
        host: '127.0.0.1',
        port: 27017,
        database: 'testStarter'
      },
      redis: {
        auth: '',
        host: '127.0.0.1',
        port: 6379,
        database: 'testStarter'
      }
    },
    services: {
      facebook: {
        token: '',
      }
    }
  };

module.exports = _.merge(specific, ip);
