var passport = require('koa-passport');

var policies = module.exports = {};

policies.ApiKey = passport.authenticate('localapikey', { session: false, failureRedirect: '/api/unauthorized' });

policies.Jwt = passport.authenticate('jwt', { session: false });

// Need to add
policies.Mine = function *(next) {
  console.log(this);
  // if(this.header.authorization){
    yield next;
  // } else {
  //   this.status = 401;
  // }
};
