var expect = require('chai').expect;
var request = require('request');
var connecter = require('../app/connecter.js');

describe('Private API Router', function () {
  describe('GET /new-data', function () {

    var value;
    var url = 'http://localhost:3000/private/new-data'

    before(function (done) {
      request(url, function (err, response, body) {
        if(err){
          console.log('Test Error ' + err);
        }
        value = JSON.parse(body);
        done();
      });
    });

    it('Sends the right keyword', function () {
      expect(value).to.deep.equal({"new-data": "STATUS"});
    });
  });

  describe('GET /queue', function () {

    var value;
    var url = 'http://localhost:3000/private/queue';

    before(function (done) {
      connecter.addToQueue(4, function () {
        connecter.addToQueue(3, function () {
          connecter.addToQueue(5, function () {
            connecter.setNewData('COFFEE', function () {
              request(url, function (err, response, body) {
                if(err){
                  console.log('Test Error ' + err);
                }
                value = JSON.parse(body);
                done();
              });
            });
          });
        });
      });
    });

    it('Sends the queue', function () {
      expect(value).to.deep.equal({"queue": ["4","3","5"]});
    });
  });

  describe('POST /status', function () {

    var status = false;
    var value;

    requestData = {
      'url' : 'http://localhost:3000/private/status',
      'method' : 'POST',
      'json' : {'beans' : '99', 'water' : '1'}
    };

    before(function (done) {
      connecter.setNewData('STATUS', function () {
        request(requestData, function (err, response) {
          if(err){
            console.log('Test Error ' + err);
          }
          if(response.statusCode == 201){
            status = true;
          }
          connecter.getStatusData(function (data) {
            value = data;
            done();
          });
        });
      });
    });

    it('Sends right status code', function () {
      expect(status).to.equal(true);
    });

    it('Stores the statuses correctly', function () {
      expect(value).to.deep.equal(requestData.json);
    });
  });
});
