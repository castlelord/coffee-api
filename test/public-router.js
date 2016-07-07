var expect = require('chai').expect;
var request = require('request');
var connecter = require('../app/connecter.js');

describe('Public API Router', function () {

  describe('GET /status', function () {

    var wert;
    var url = 'http://localhost:3000/public/status';

    before(function (done) {
      request(url, function (err, response, body) {
        wert = JSON.parse(body);
        done();
      })
    })

    it('Sends the right Data', function () {
      expect(wert).to.deep.equal({ beans: '99', water: '1' });
    });
  });

  describe('GET /queue', function () {

    var value;
    var url = 'http://localhost:3000/public/queue';

    before(function (done) {
      connecter.addToQueue(4, function () {
        connecter.addToQueue(3, function () {
          connecter.addToQueue(5, function () {
            connecter.setNewData('COFFEE', function () {
              request(url, function (err, response, body) {
                if(err){
                  console.log('Test Error ' + err);
                }
                value = JSON.parse(body).queue;
                done();
              });
            });
          });
        });
      });
    });

    it('Sends the right Data', function () {
      expect(value).to.deep.equal(["4","3","5"]);
    });
  });

  describe('POST /coffee', function () {

    var value;
    var newData;
    var requestData = {
      'url' : 'http://localhost:3000/public/coffee',
      'method' : 'POST',
      'json' : {'coffee' : 12}
    }

    before(function (done) {
      connecter.setNewData('NONE', function () {
        request(requestData, function (err, response, body) {
          value = response.statusCode;
          connecter.getNewData(function (reply) {
            newData = reply;
            done();
          });
        });
      });
    });

    it('Sets the right NewData', function () {
      expect(newData).to.equal('COFFEE');
    })

    it('Sends the right status code', function () {
      expect(value).to.equal(201);
    });

    after(function (done) {
      connecter.setNewData('NONE', function () {
        connecter.setStatusData(100, 100, function () {
          connecter.getQueueLength(function (length) {
            function repeatPop(i,max) {
              if(i <= max){
                connecter.popFrontOfQueue(function (coffee) {
                  i++;
                  repeatPop(i,max);
                });
              }
              else {
                done();
              }
            }
            repeatPop(0,length -1);
          });
        });
      });
    });
  });
});
