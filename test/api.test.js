'use strict';

var supertest = require('supertest');
var app = require('../app');
var should = require('should');

var config = require('../config/env/test');

function request() {
  return supertest(app.listen());
}

// This agent refers to PORT where program is runninng.

var server = supertest.agent(config.server.url);

// UNIT test begin

describe('General unit test',function(){

  // #1 should return home page

  // it('should return code 200',function(done){
  //   //console.log(config.server.port);
  //   // calling home page api
  //   server
  //   request()
  //   .get('/')
  //   .expect('Content-type',/json/)
  //   .expect(200) // THis is HTTP response
  //   .end(function(err,res){
  //     // HTTP status should be 200
  //     res.status.should.equal(200);
  //     done();
  //   });
  // });

   it("should return 404",function(done){
    server
    request()
    .get("/random")
    .expect(404)
    .end(function(err,res){
      res.status.should.equal(404);
      done();
    });
  });
});
