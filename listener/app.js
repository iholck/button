'use strict';


//var serverIP = 'mosquitto';
var serverIP = '10.10.12.72';
var databaseName = 'ButtonBase';
var databaseTableName = "ButtonTable";
var mqtt = require('mqtt');
var tools = require('./tools');
var crypto = require('crypto');
var request = require('request');






var mqttOptions = {
    keepalive: 10,
    clientId: "listener."+crypto.randomBytes(20).toString('hex'),
    protocolId: 'MQTT',
    protocolVersion: 4,
    clean: true,                  //set to false to receive QoS 1 and 2 messages while offline
    reconnectPeriod: 1000,
    connectTimeout: 30 * 1000,
    will: {                       //in case of any abnormal client close this message will be fired
        topic: 'ErrorMsg',
        payload: 'Listener Connection Closed abnormally..!',
        qos: 0,
        retain: false
    },
    username: 'button',
    password: 'pressme!!',
    rejectUnauthorized: false,
  };
var mqttClient = mqtt.connect('mqtt://' + serverIP, mqttOptions);
var sqlConnection = require('./db');
var deviceConfig = [];



function checkDatabase() {

    sqlConnection.query('CREATE DATABASE IF NOT EXISTS ' + databaseName + ';', function(error, results) {
        if (error) {
            console.log(error);
        }
    });
    console.log('DatabaseCheck done');

};

function setupTable() {

    var sqlQuery = "CREATE TABLE " + databaseTableName + " (id INT AUTO_INCREMENT PRIMARY KEY, timestamp DATETIME, button VARCHAR(255), value INT);";

    sqlConnection.query(sqlQuery, function(error, results) {
        if (error) {
            console.log(error);
        } else {
            console.log('Table has been setup');
        }
    });
};

function checkTableSetup() {

    var sqlQuery = "SELECT count(*) as count FROM information_schema.tables WHERE table_schema = '" + databaseName + "' AND table_name = '" + databaseTableName + "';";

    sqlConnection.query(sqlQuery, function(error, results) {
        if (error) {
            console.log('Error: ' + error);
        }else if (results[0].count < 1) {
            console.log('Table not setup, trying that..');
            setupTable();
        }
    });
};

function getDeviceConfig(){
  var macs = [];
  var getValidMacsOptions = {
      url: 'http://10.10.12.72:3000/config',
      method: 'GET',
      headers: {
          'Accept': 'application/json',
          'Accept-Charset': 'utf-8'
      }
  };

  request(getValidMacsOptions, function(err, res, body) {

    deviceConfig = JSON.parse(body);
    console.log('DeviceConfig: '+body);
    setTimeout(getDeviceConfig,60000);
  });
};

function storeNewMac(mac){
  var storeMacOptions = {
      'url': 'http://10.10.12.72:3000/config',
      'method': 'POST',
      'headers': {
          'Accept': 'application/json',
          'Accept-Charset': 'utf-8'
      },
      'json': { 'mac':''}
  };
  storeMacOptions.json.mac = mac;
request(storeMacOptions, function(err, res, body) {
console.log('Storing: '+JSON.stringify(storeMacOptions));
  });
};

function storeData(buttonName, buttonData) {
    var sqlQuery;

    var myTimestamp;

    myTimestamp = tools.ISODateString(new Date());
    console.log(myTimestamp + " - " + buttonName + ":" + buttonData);

    sqlQuery = "INSERT INTO " + databaseTableName + " (timestamp, button, value) VALUES ('" + myTimestamp + "', '" + buttonName + "', '" + buttonData + "');";
    sqlConnection.query(sqlQuery, function(error, results) {
        if (error) {
            console.log('Error: ' + error);
        }
    });
}

//SQL checks

console.log('Doing DB checks..');
checkTableSetup();
console.log('Getting device configurations');
getDeviceConfig();

console.log('Great! Going on to MQTT!');

//MQTT message processing

mqttClient.on('connect', function() {
    mqttClient.subscribe('button/feeds/buttons');
    console.log('Connected to MQTT server!');
});

mqttClient.on('message', function(topic, message) {
    var i;
    var len;
    var isFound = false;

    var parsMessage = message.toString().split(":");
    console.log(message.toString());
    // The format is macAddr:value.
    if (typeof(parsMessage[1]) !== "undefined" && parsMessage[1] !== null) {
      for (i = 0, len = deviceConfig.length; i < len; i++) {
        if(deviceConfig[i].mac === parsMessage[0]){
          if(deviceConfig[i].configured === true){
            console.log('Mac found and valid. Storing data');
            storeData(parsMessage[0], parsMessage[1]);
            isFound = true;
            break;
          }else{
            console.log('Mac found but not authorized: '+parsMessage[0]);
            isFound = true;
            break;
          };

        }

      }
      if(isFound === false){
          console.log('Mac not found, trying to store '+parsMessage[0]);
          storeNewMac(parsMessage[0]);
          setTimeout(getDeviceConfig,1000);
        }

    }
});
