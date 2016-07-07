var express = require('express');
var router = express.Router();
var connecter = require('../app/connecter.js');

router.get('/status', function (req, res) {
  connecter.getNewData(function (reply) {
    switch (reply) {
      case 'NONE':
        connecter.setNewData('STATUS', function () {
          responder();
        });
        break;

      case 'COFFEE':
        connecter.setNewData('BOTH', function () {
          responder();
        });
        break;

      case 'BOTH':
        connecter.setNewData('BOTH', function () {
          responder();
        });
        break;

      default:
        connecter.setNewData('STATUS', function () {
          responder();
        });
    }

    function responder() {
      connecter.getStatusData(function (reply) {
        res.json(reply);
      });
    }
  });
});

router.get('/queue', function (req, res) {
  connecter.getQueueLength(function (length) {
    var queue = [];

    function repeatPop(i,max) {
      if(i <= max){
        connecter.popFrontOfQueue(function (coffee) {
          queue[i] = coffee;
          i++;
          connecter.addToQueue(coffee, function () {
            repeatPop(i,max);
          });
        });
      }
      else {
        res.json({"queue" : queue});
      }
    }
    repeatPop(0,length -1);
  })
});

router.post('/coffee', function (req, res) {
  console.log(req.body);
  connecter.addToQueue(req.body.coffee, function () {
    connecter.getNewData(function (reply) {
      switch (reply) {
        case 'NONE':
          connecter.setNewData('COFFEE', function () {
            responder();
          });
          break;

        case 'STATUS':
          connecter.setNewData('BOTH', function () {
            responder();
          });
          break;

        case 'BOTH':
          connecter.setNewData('BOTH', function () {
            responder();
          });
          break;

        default:
          connecter.setNewData('COFFEE', function () {
            responder();
          });
      }

      function responder() {
        res.sendStatus(201);
      }
    });
  });
});

module.exports = router;
