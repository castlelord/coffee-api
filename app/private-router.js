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
      console.log(i);
      if(i <= max){
        connecter.popFrontOfQueue(function (coffee) {
          queue[i] = coffee;
          i++;
          repeatPop(i,max);
        });
      }
      else {
        res.json({"queue" : queue});
      }
    }

    repeatPop(0,length -1);
  })
});

router.post('/status', function (req, res) {
  if(req.body.beans != undefined && req.body.water != undefined){
    connecter.setStatusData(req.body.beans, req.body.water, function () {
      res.sendStatus(201);
    });
  }
  else{
    res.sendStatus(406);
  }
});

router.post('/finished', function (req, res) {

});

module.exports = router;
