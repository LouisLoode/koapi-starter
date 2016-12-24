'use strict';

var supertest = require('supertest');
var queue = require('kue').createQueue();
var app = require('../../app');
var expect = require('expect.js');
var faker = require('faker');




faker.locale = 'fr';

var config = require('../../config/env/test');

function random(size) {
    var liste = ["a","b","c","d","e","f","g","h","i","j","k","l","m","n","o","p","q","r","s","t","u","v","w","x","y","z","0","1","2","3","4","5","6","7","8","9"];
    var result = '';
    for (var i = 0; i < size; i++) {
        result += liste[Math.floor(Math.random() * liste.length)];
    }
    return result;
}


var randomName = random(10);
var randomEmail = faker.internet.email();
var randomDescription = faker.lorem.paragraph();
var randomLocation = faker.address.city();
var randomUrl = 'http://perso.nal'


function request() {
  return supertest(app.listen());
}

// This agent refers to PORT where program is runninng.

var server = supertest.agent(config.server.url);
// console.log(config.server.url);
// UNIT test begin

describe('Authentication',function(){
  // before(function() {
  //   queue.testMode.enter();
  // });
  //
  // afterEach(function() {
  //   queue.testMode.clear();
  // });
  //
  // after(function() {
  //   queue.testMode.exit()
  // });
  //
  // it('does something cool', function() {
  //   queue.createJob('notification', { foo: 'bar' }).save();
  // 	console.log(queue.testMode.jobs.length);
  //   expect(queue.testMode.jobs.length).to.equal(2);
  // });
  var id

  it('register an user',function(done){
    // calling home page api
    server
    request()
    .post('/api/auth/register')
    .send({
        'username':randomName,
        'email':randomEmail,
        'password':'testtest',
        'password2':'testtest'
      })
    .set('Content-Type', 'application/json')
    .end(function(err,res){
        // console.log(res.body)
        expect(res.body).to.not.be.empty();
        expect(typeof res.body).to.eql('object')
        expect(res.body.data).to.have.key('id')
        expect(res.body.meta.code).to.eql(200)
        expect(res.body.data.username).to.eql(randomName)
        expect(res.body.data.email).to.eql(randomEmail)
        expect(res.body.data.rights.type).to.eql('user')
        // expect(res.body.data.website).to.eql(null)
        // expect(res.body.data.location).to.eql(null)
        // expect(res.body.data.description).to.eql(null)
        // expect(res.body.data.cover).to.eql(null)
        // expect(res.body.data.avatar).to.eql(null)
        id = res.body.data.id
        //console.log(id);
        done();
    });
  });

  it('login an user',function(done){
    // calling home page api
    server
    request()
    .post('/api/auth/login')
    .send({
        'email':randomEmail,
        'password':'testtest'
      })
    .set('Content-Type', 'application/json')
    .end(function(err,res){
        // console.log(res.body)
        // expect(res.body).to.not.be.empty();
        expect(typeof res.body).to.eql('object')
        expect(res.body.data.user).to.have.key('id')
        expect(res.body.data).to.have.key('token')
        expect(res.body.meta.code).to.eql(200)
        expect(res.body.data.user.username).to.eql(randomName)
        expect(res.body.data.user.email).to.eql(randomEmail)
        expect(res.body.data.user.rights.type).to.eql('user')

        //console.log(id);
        done();
    });
  });

  it('forgot password',function(done){
    // calling home page api
    server
    request()
    .post('/api/auth/forgot-password')
    .send({
        'email':randomEmail,
      })
    .set('Content-Type', 'application/json')
    .end(function(err,res){
        console.log(res.body)
        // expect(res.body).to.not.be.empty();
        expect(res.body.meta.code).to.eql(200)
        expect(res.body.data).to.eql('you should receive an email')

        //console.log(id);
        done();
    });
  });

  it('removes an user', function(done){
      server
      request()
      .delete('/api/user/' + id)
      .end(function(err, res){
        // console.log(res.body)
        expect(err).to.eql(null)
        expect(typeof res.body).to.eql('object')
        expect(res.body.meta.ok).to.eql(true)
        expect(res.body.meta.code).to.eql(200)
        done()
      })
  })

});
