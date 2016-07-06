var express = require('express');
var router = express.Router();
var connecter = require('../app/connecter.js');

router.get('/status', function (req, res) {
  connecter.getNewData(function (reply) {
    if(reply != 'COFFEE'){
      connecter.setNewData('STATUS')
    }
  })
});

router.get('/queue', function (req, res) {

});

router.post('/coffee', function (req, res) {

});

module.exports = router;
