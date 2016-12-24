'use strict';

var path = require('path');
var _ = require('lodash');

var specific = {
    server: {
      protocol: 'http',
      host: '127.0.0.1:8000',
      url: 'http://127.0.0.1:8000',
      port: 8000,
      name: 'Starter Koa - Dev',
      keys: [ 'super-secret' ],
      secret: 'secret for JWT'
    },
    front: {
      url : 'http://localhost:8080'
    },
    db: {
      mongo: {
        user: '',
        pass: '',
        host: '127.0.0.1',
        port: 27017,
        database: 'secret-project'
      },
      redis: {
        auth: '',
        host: '127.0.0.1',
        port: 6379,
        database: 'testStarter'
      }
    },
    mailgun: {
      api_key: '',
      from: 'Yummyti.me <contact@yummyti.me>',
      url: 'https://api.mailgun.net/v3/yummyti.me/messages'
    },
    facebook: {
      redirect_uri: 'http://localhost:8000/connect/facebook/callback',
      key: '',
      secret: '',
      callback: '/api/auth/handle_facebook',
      scope: [
        'email'
      ]
    },
    soundcloud: {
      client_id: '84c5f401b00695798b1f3286d4f6d04c',
      client_secret: '2ab61f5e4326723c1729dc475a264d3b'
    }
  };

module.exports = _.merge(specific);
