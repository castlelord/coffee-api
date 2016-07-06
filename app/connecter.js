var redis = require('redis');

var client = redis.createClient(process.env.PORT || 6379);

client.on('error', function (err) {
  console.log("Error " + err);
});

exports.setNewData = function (newData, next) {
  if(newData === 'NONE' || newData === 'COFFEE' || newData === 'STATUS' || newData === 'BOTH'){
    client.set('new-data', newData, next);
    /*client.get('new-data', function (err, reply) {
      if (err){
        console.log('Error ' + err);
      }

      switch (reply) {
        case 'COFFEE':
          if(newData == 'STATUS'){
            console.log(1);
            client.set('new-data', 'BOTH', next);
          }
          else {
            console.log(2);
            client.set('new-data', newData, next);
          }
          break;

        case 'STATUS':
          if(newData == 'COFFEE'){
            console.log(3);
            client.set('new-data', 'BOTH', next);
          }
          else {
            console.log(4);
            client.set('new-data', newData, next);
          }
          break;

        default:
          console.log(5);
          client.set('new-data', newData, next);
      }
    });*/
  }
  else {
    console.log(newData + ' is not a possible value');
    next();
  }
}

exports.getNewData = function (next) {
  client.get('new-data', function (err, reply) {
    if (err){
      console.log('Error ' + err);
    }
    next(reply);
  });
}

exports.setStatusData = function (beans, water, next) {
  client.set('beans', beans, function () {
    client.set('water', water, next);
  });
}

exports.getStatusData = function (next) {
  client.get('beans', function(err, reply){
    if(err){
      console.log('Error ' + err);
    }
    var data = {'beans' : reply};
    client.get('water', function (err, reply) {
      if(err){
        console.log('Error ' + err);
      }
      data.water = reply;
      next(data);
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

exports.addToQueue = function (coffee, next) {
  client.rpush('queue', coffee, function (err) {
    if(err){
      console.log('Error ' + err);
    }
    next();
  });
}

exports.getQueueLength = function (next) {
  client.llen('queue', function (err, reply) {
    if(err){
      console.log('Error ' + err);
    }
    next(reply);
  });
}
