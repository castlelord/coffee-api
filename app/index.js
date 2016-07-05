var express = require('express');
var app = express();
var port = process.env.PORT || 3000;
var server = app.listen(port);

var bodyParser = require('body-parser');
app.use(bodyParser.json());

var pubApi = require('../app/public-router.js');
var priApi = require('../app/private-router.js');

app.use('/public', pubApi);
app.use('/private', priApi);
