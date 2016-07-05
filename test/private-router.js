var expect = require('chai').expect;
var request = require('request');

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
      expect(value).to.deep.equal({"new-data": "BOTH"});
    });
  });
});
