var expect = require('chai').expect;
var connecter = require('../app/connecter.js');

var redis = require('redis');
var client = redis.createClient(process.env.PORT || 6379);

describe('Redis Connection Interface', function () {

  describe('Function setNewData', function () {

    var value = [];

    before(function(done){
      connecter.setNewData('NONE', function () {
        client.get('new-data', function (err, reply) {
          if (err){
            console.log('Test Error ' + err);
          }
          value[0] = reply;
          done();
        });
      });
    });

    it('Stores NONE as NONE', function () {
      expect(value[0]).to.equal('NONE');
    });

    before(function(done){
      connecter.setNewData('COFFEE', function () {
        client.get('new-data', function (err, reply) {
          if (err){
            console.log('Test Error ' + err);
          }
          value[1] = reply;
          done();
        });
      });
    });

    it('Stores COFFEE as COFFEE', function () {
      expect(value[1]).to.equal('COFFEE');
    });

    before(function(done){
      connecter.setNewData('STATUS', function () {
        client.get('new-data', function (err, reply) {
          if (err){
            console.log('Test Error ' + err);
          }
          value[2] = reply;
          done();
        });
      });
    });

    it('Stores STATUS as STATUS', function () {
      expect(value[2]).to.equal('STATUS');
    });

    before(function(done){
      connecter.setNewData('BOTH', function () {
        client.get('new-data', function (err, reply) {
          if (err){
            console.log('Test Error ' + err);
          }
          value[3] = reply;
          done();
        });
      });
    });

    it('Stores BOTH as BOTH', function () {
      expect(value[3]).to.equal('BOTH');
    });

    before(function(done){
      connecter.setNewData('Not a valid keyword', function () {
        client.get('new-data', function (err, reply) {
          if (err){
            console.log('Test Error ' + err);
          }
          value[4] = reply;
          done();
        });
      });
    });

    it('Stores only valid keywords', function () {
      expect(value[4]).to.not.equal('Not a valid keyword');
    });
  });

  describe('Function getNewData', function () {

    var value;

    before(function (done) {
      connecter.getNewData(function (data) {
        value = data;
        done();
      });
    });

    it('Gets the right data', function () {
      expect(value).to.equal('BOTH');
    });
  });

  describe('Function setStatusData', function () {

    var beans;
    var water;

    before(function (done) {
      connecter.setStatusData(1, 99, function () {
        client.get('beans', function (err, reply) {
          if (err){
            console.log('Test Error ' + err);
          }
          beans = reply;
          client.get('water', function (err, reply) {
            if (err){
              console.log('Test Error ' + err);
            }
            water = reply;
            done();
          });
        });
      });
    });

    it('Stores Data correctly', function () {
      expect(beans).to.equal('1');
      expect(water).to.equal('99');
    });
  });

  describe('Function getStatusData', function () {

    var status = {};

    before(function (done) {
      connecter.getStatusData(function (data) {
        status.beans = data.beans;
        status.water = data.water;
        done();
      });
    });

    it('Gets the right Data', function () {
      expect(status.beans).to.equal('1');
      expect(status.water).to.equal('99');
    });
  });

  describe('Function addToQueue', function () {

     var value;

     before(function (done) {
       connecter.addToQueue(50, function () {
         client.rpop('queue', function (err, reply) {
           if (err){
             console.log('Test Error ' + err);
           }
           value = reply;
           client.rpush('queue', 50, function () {
             if (err){
               console.log('Test Error ' + err);
             }
             done();
           });
         });
       });
     });

     it('Stores values correctly', function () {
       expect(value).to.equal('50');
     });
  });

  describe('Function popFrontOfQueue', function () {

    var value;

    before(function (done) {
      connecter.popFrontOfQueue(function (data) {
        value = data;
        done();
      });
    });

    it('Removes the rigth value', function () {
      expect(value).to.equal('50');
    });
  });

  describe('Function getQueueLength', function () {

    var value = false;

    before(function (done) {
      connecter.getQueueLength(function (data) {
        client.llen('queue', function (err, reply) {
          if(err){
            console.log('Test Error ' + err);
          }
          if(data == reply){
            value = true;
          }
          done();
        });
      });
    });

    it('Gets the corect length', function () {
      expect(value).to.equal(true);
    });
  });
});
