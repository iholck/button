'use strict';


var serverIP = 'mosquitto';
var databaseName = 'ButtonBase';
var databaseTableName = "ButtonTable";
var mqtt = require('mqtt');
var tools = require('./tools');
var crypto = require('crypto');
var $ = require('jQuery');
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
var validMacs = [];


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

function getValidMacs(){
  var macs = [];
  $.getJSON('http://10.10.12.72:3000/config/getConfigured',function(data) {
    data.forEach( function (entry){
          validMacs.push(entry.mac);
      });
    });
    return macs;
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
console.log('Getting authorized mac addresses');
validMacs = getValidMacs();

console.log('Great! Going on to MQTT!');

//MQTT message processing

mqttClient.on('connect', function() {
    mqttClient.subscribe('button/feeds/buttons');
    console.log('Connected to MQTT server!');
});

mqttClient.on('message', function(topic, message) {
    // message is Buffer
    var parsMessage = message.toString().split(":");
    // The format is macAddr:value.
    if (typeof(parsMessage[1]) !== "undefined" && parsMessage[1] !== null) {
      if(validMacs.indexOf(parsMessage[0])!== -1){
        storeData(parsMessage[0], parsMessage[1]);
      } else {
        console.log('Invalid MAC Address');
      }
    }

    //  console.log(message.toString());
    //  client.end()
});
