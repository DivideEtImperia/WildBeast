var ConfigFile = require("../config.json");
var Redis = require("redis");
var Logger = require("./logger.js").Logger;

var RedisServer = Redis.createClient(ConfigFile.redis.port, ConfigFile.redis.host);

exports.GetLevel = function(sum, user, callback){
  if (user === ConfigFile.permissions.masterUser){
    return callback (null, 9); // Return a massive value if the user is the master user
  }
  if (user == ConfigFile.permissions.level1){
    return callback (null, 1); // Hardcoded reply if user has a global permission
  }
  if (user == ConfigFile.permissions.level2){
    return callback (null, 2); // Hardcoded reply if user has a global permission
  }
  if (user == ConfigFile.permissions.level3){
    return callback (null, 3); // Hardcoded reply if user has a global permission
  }
  // Else, connect to the Redis server and fetch the user level
  RedisServer.get("auth_level:" + sum, function(err, reply) {
		if (err) {
      return callback(err, -1);
    }
		if (reply) {
			return callback(null, parseInt(reply));
		} else {
			callback(null, 0); // Return 0 if no value present in Redis
		}
	});
};

exports.GetNSFW = function(channel, callback){
  RedisServer.get("auth_nsfw:" + channel, function(err, reply) {
    if (err) {
      return callback(err, -1);
    }
    if (reply) {
      return callback(null, reply);
    } else {
      callback(null, "off");
    }
  });
};

exports.SetLevel = function(sum, level, callback){
  RedisServer.set("auth_level:" + sum, parseInt(level), function(err, reply) {
    if (err) {
      callback(err, -1);
    }
    if (reply) {
      callback(null, parseInt(level));
    } else {
      return callback(null, 0);
    }
  });
};

exports.SetNSFW = function(channel, allow, callback){
	RedisServer.set("auth_nsfw:" + channel, allow, function(err, reply) {
		if (err) {
      callback(err, -1);
    }
		if (reply) {
			callback(null, allow);
		} else {
			return callback(null, null);
		}
	});
};
