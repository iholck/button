'use strict';

var request = require('request');

function getDeviceConfig(){
  var macs = [];
  var getValidMacsOptions = {
      url: 'http://10.10.12.101:3000/config',
      method: 'GET',
      headers: {
          'Accept': 'application/json',
          'Accept-Charset': 'utf-8'
      }
  };

  request(getValidMacsOptions, function(err, res, body) {
    var list = $('#list');
    var li;
    deviceConfig = JSON.parse(body);
    console.log('DeviceConfig: '+body);
    for (var i=0; i>deviceConfig.length;i++){
      add_list_item(deviceConfig[i].mac);
    }
  });
};

function add_list_item(mac){
  var ul = $('#dynamic-list');
  var $li = $("<li>", {id: "li-"+mac, "class": "li"});

    li.appendChild(document.createTextNode(candidate.value));
    ul.appendChild(li);
};

var myI = 0;
$( document ).ready(function() {
    console.log( "ready!" );
    getDeviceConfig();


});
