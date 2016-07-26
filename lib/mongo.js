'use strict';
const Client = require('mongodb').MongoClient;

module.exports = function(config, callback){
  let conString = 'mongodb://'

  config.host = config.host || "localhost";
  config.port = config.port || "27017";
  config.database = config.database || "test";

  if(config.username){
    conString += (config.username)
    if(config.password)
      conString += (`:${config.password}@`)
  }

  conString += (`${config.host}:${config.port}/${config.database}`);
  Client.connect(conString, callback);
}
