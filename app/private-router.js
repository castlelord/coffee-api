var express = require('express');
var router = express.Router();
var connecter = require('../app/connecter.js');

router.get('/new-data', function (req, res) {
  connecter.getNewData(function (data) {
    res.json({"new-data" : data});
  })
});

router.get('/queue', function (req, res) {
  connecter.getQueueLength(function (length) {
    var queue = [];

    function repeatPop(i,max) {
      if(i <= max){
        connecter.popFrontOfQueue(function (coffee) {
          queue[i] = coffee;
          i++;
          repeatPop(i,max);
        });
      }
      else {
        res.json({"queue" : queue});
        connecter.getNewData(function (reply) {
          switch (reply) {
            case 'COFFEE':
              connecter.setNewData('NONE', function () {
                console.log('Set new-data to NONE');
              });
              break;

            case 'BOTH':
              connecter.setNewData('STATUS', function () {
                console.log('Set new-data to STATUS');
              });
              break;

            default:
              console.log('Error: Wrong new-data');
          }
        });
      }
    }
    repeatPop(0,length -1);
  })
});

router.post('/status', function (req, res) {
  if(req.body.beans != undefined && req.body.water != undefined){
    connecter.setStatusData(req.body.beans, req.body.water, function () {
      res.sendStatus(201);
      connecter.getNewData(function (reply) {
        switch (reply) {
          case 'STATUS':
            connecter.setNewData('NONE', function () {
              console.log('Set new-data to NONE');
            });
            break;

          case 'BOTH':
            connecter.setNewData('COFFEE', function () {
              console.log('Set new-data to COFFEE');
            });
            break;
          default:
          console.log('Error: Wrong new-data');
        }
      });
    });
  }
  else{
    res.sendStatus(406);
  }
});

router.post('/finished', function (req, res) {

});

module.exports = router;
