'use strict';

var dirname = require('path').dirname;
var boom = require ('boom');
var version;

try {
  version = require('../../package.json').version;
} catch(e) {}

module.exports = function (options) {
  options = options || {};
  return function *koaRes(next) {
    yield* next;
    if (this.status == 200) {
        var status = this.status;
        var data = this.body;
        if (this.method.toLowerCase !== 'option') {
          if (data == null){
            this.body = {
              meta: {
                ok: true,
                code: this.status,
                version: options.version || version || '1.0.0',
                now: new Date()
              }
            };
          } else {
            this.body = {
              meta: {
                ok: true,
                code: this.status,
                version: options.version || version || '1.0.0',
                now: new Date()
              },
              data: data
            };
          }
          this.status = status;
        }
    }
    else if (this.status == 400) {
        var status = this.status;
        var data = this.body;
            this.body = {
              meta: {
                ok: false,
                code: this.status,
                version: options.version || version || '1.0.0',
                now: new Date()
              },
              data: data
            };
          this.status = status;
    }
    else if (this.status == 401) {
        var status = this.status;
        var data = 'Unauthorized';
            this.body = {
              meta: {
                ok: false,
                code: this.status,
                version: options.version || version || '1.0.0',
                now: new Date()
              },
              data: data
            };
          this.status = status;
    }
    else if (this.status == 404) {
        var status = this.status;
        var data = 'Not found';
            this.body = {
              meta: {
                ok: false,
                code: this.status,
                version: options.version || version || '1.0.0',
                now: new Date()
              },
              data: data
            };
          this.status = status;
    }
    else if (this.status == 500) {
        var status = this.status;
        var data = 'Server error';
            this.body = {
              meta: {
                ok: false,
                code: this.status,
                version: options.version || version || '1.0.0',
                now: new Date()
              },
              data: data
            };
          this.status = status;
    }
  };
};
