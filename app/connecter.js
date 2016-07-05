var redis = require('redis');

var client = redis.createClient(process.env.PORT || 6379);

client.on("error", function (err) {
  console.log("Error " + err);
});

exports.setNewData = function (newData, next) {
  if(newData === 'NONE' || newData === 'COFFEE' || newData === 'STATUS' || newData === 'BOTH'){
    client.set('new-data', newData, next);
  }
  else {
    console.log(newData + ' is not a possible value');
  }
}

exports.setStatusData = function (beans, water, next) {
  client.set('beans', beans, function () {
    client.set('water', water, next);
  });
}

exports.getStatusData = function (next) {
  client.get('beans', function(err, reply){
    if(err){
      console.log('Error 'err);
    }
    var data = {'beans' : reply};
    client.get('water', function (err, reply) {
      data.water = reply;
      return data;
    });
  });
}

exports.popFrontOfQueue = function (next) {
  client.lpop('queue', function (err, reply) {
    if(err){
      console.log('Error ' + err);
    }
    next(reply);
  });
}

exports.addToQueue = function (coffee) {
  client.rpush('queue', coffee, function (err) {
    if(err){
      console.log('Error ' + err);
    }
  });
}
