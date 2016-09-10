'use strict';

var supertest = require('supertest');
var app = require('../../app');
var expect = require('expect.js');
var faker = require('faker');
faker.locale = 'fr';

var config = require('../../config/env/test');


var randomName = faker.commerce.productName();
var randomContent = faker.lorem.paragraph();
var randomNameUser = 'TestUserForMessage';
var randomEmail = faker.internet.email();
var randomDescription = faker.lorem.paragraph();
var randomLocation = faker.address.city();
var randomUrl = 'http://perso.nal'


function request() {
  return supertest(app.listen());
}

// This agent refers to PORT where program is runninng.

var server = supertest.agent(config.app.url);
// console.log(config.app.url);
// UNIT test begin

describe('CRUD Message',function(){
  var id
  var id_user
  var token

  it('register an user',function(done){
    // calling home page api
    server
    request()
    .post('/api/auth/register')
    .send({
        'username':randomNameUser,
        'email':randomEmail,
        'password':'testtest',
        'password2':'testtest'
      })
    .set('Content-Type', 'application/json')
    .end(function(err,res){
        // console.log(res.body)
        // expect(res.body).to.not.be.empty();
        expect(typeof res.body).to.eql('object')
        expect(res.body.data).to.have.key('id')
        expect(res.body.meta.code).to.eql(200)
        expect(res.body.data.username).to.eql(randomNameUser)
        expect(res.body.data.email).to.eql(randomEmail)
        expect(res.body.data.rights.type).to.eql('user')
        expect(res.body.data.informations.website).to.eql(null)
        expect(res.body.data.informations.location).to.eql(null)
        expect(res.body.data.informations.description).to.eql(null)
        expect(res.body.data.pictures.cover).to.eql(null)
        expect(res.body.data.pictures.avatar).to.eql(null)
        id_user = res.body.data.id
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
        'username':randomNameUser,
        'password':'testtest'
      })
    .set('Content-Type', 'application/json')
    .end(function(err,res){
        // console.log(res.body)
        // expect(res.body).to.not.be.empty();
        expect(typeof res.body).to.eql('object')
        // expect(res.body.data.user).to.have.key('id')
        expect(res.body.data).to.have.key('token')
        expect(res.body.meta.code).to.eql(200)
        expect(res.body.data.user.username).to.eql(randomNameUser)
        expect(res.body.data.user.email).to.eql(randomEmail)
        // expect(res.body.data.token).to.eql(randomEmail)
        expect(res.body.data.user.rights.type).to.eql('user')
        token = res.body.data.token;
        // console.log(token);
        done();
    });
  });


  it('post a message',function(done){
    // calling home page api
    server
    request()
    .post('/api/message')
    .send({
      name: randomName,
      content: randomContent
    })
    .set('Content-Type', 'application/json')
    .set('Authorization', token)
    .end(function(err,res){
        // console.log(res.body)
        // expect(res.body).to.not.be.empty();
        expect(typeof res.body).to.eql('object')
        // expect(res.body.data).to.have.key('_id')
        expect(res.body.meta.code).to.eql(200)
        id = res.body.data.id
        //console.log(id);
        done();
    });
  });


  it('get a message - 200',function(done){
    server
    request()
    .get('/api/message/' + id)
    .set('Authorization', token)
    .set('Content-Type', 'application/json')
    .end(function(err,res){
        //console.log(res.body)
        expect(res.body).to.not.be.empty();
        expect(typeof res.body).to.eql('object')
        expect(res.body.data).to.have.key('id');
        expect(res.body.data.id).to.eql(id)
        expect(res.body.meta.code).to.eql(200)
        done();
    });
  });

  it('get a message - 404',function(done){
    server
    request()
    .get('/api/message/qsd' + id)
    .set('Authorization', token)
    .set('Content-Type', 'application/json')
    .expect(404)
    .end(function(err,res){
        //console.log(res.body)
        //expect(res.body).to.not.be.empty();
        // expect(res.body.meta.ok).to.eql(false)
        done();
    });
  });

  it('get a collection of message',function(done){
    server
    request()
    .get('/api/messages')
    .set('Authorization', token)
    .set('Content-Type', 'application/json')
    .end(function(err,res){
        //console.log(res.body)
        expect(res.body).to.not.be.empty();
        expect(typeof res.body).to.eql('object')
        expect(err).to.eql(null)
        expect(res.body.data.map(function (item){return item.id})).to.contain(id)
        expect(res.body.meta.code).to.eql(200)
        done();
    });
  });

  it('update a message', function(done){
    server
    request()
    .put('/api/message/' + id)
    .send({
      name: randomName + 'update',
      content: randomContent + 'update'
    })
    .set('Authorization', token)
    .set('Content-Type', 'application/json')
    .end(function(err,res){
        //console.log(res.body)
        expect(err).to.eql(null)
        expect(typeof res.body).to.eql('object')
        expect(res.body.meta.ok).to.eql(true)
        expect(res.body.meta.code).to.eql(200)
        done();
    });
  })
  it('checks an updated object', function(done){
      server
      request()
      .get('/api/message/' + id)
      .set('Authorization', token)
      .set('Content-Type', 'application/json')
      .end(function(err, res){
        // console.log(res.body)
        expect(err).to.eql(null)
        expect(typeof res.body).to.eql('object')
        expect(res.body.data.id).to.eql(id)
        expect(res.body.data.name).to.eql(randomName + 'update')
        expect(res.body.data.content).to.eql(randomContent + 'update')
        done()
      })
  })

  it('removes an object', function(done){
      server
      request()
      .delete('/api/message/' + id)
      .set('Authorization', token)
      .end(function(err, res){
        // console.log(res.body)
        expect(err).to.eql(null)
        expect(typeof res.body).to.eql('object')
        expect(res.body.meta.ok).to.eql(true)
        expect(res.body.meta.code).to.eql(200)
        done()
      })
  })

  it('removes an user', function(done){
      server
      request()
      .delete('/api/user/' + id_user)
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
