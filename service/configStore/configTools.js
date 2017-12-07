'use strict';

const DevType = require('./configClass');
const createId = require('./utils');

class ConfigTools{
constructor() {
	this.config = [

		];
  }



  getAll() {
   return this.config;
  };


  getById(id){
   return this.config.find(conf => conf.id === id);
  }

  getByMac(mac){
   return this.config.find(conf => conf.mac === mac);
  }

  deleteById(id){

   this.config = this.config.filter(conf => conf.id !== id);
  }

  deleteByMac(mac){

   this.config = this.config.filter(macAddr => macAddr.id !== mac);
  }

  setConfigured(mac){
    const myIndex= this.config.findIndex((obj => obj.mac === mac));
    this.config[myIndex].configured = true;
    return this.config[myIndex];
  }

  setUnconfigured(mac){
    const myIndex= this.config.findIndex((obj => obj.mac === mac));
    this.config[myIndex].configured = false;
    return this.config[myIndex];
  }

  updateByMac(mac,name,regexp){
    if(typeof mac !== 'undefined'){
      const myIndex= this.config.findIndex((obj => obj.mac === mac));
      if(typeof name !== 'undefined' && name.length>0){
        this.config[myIndex].name = name;
      };
      if(typeof regexp !== 'undefined' && regexp.length>0){
    this.config[myIndex].regexp = regexp;
  };

    return this.config[myIndex];
    }
  }

  createConfEntry(mac,name,regexp){
   const myId = createId();
   const myName = name || 'Unconfigured';
   const myRegexp = regexp || '';
   if(mac.match(/^(\d|[a-f]|[A-F]){12}$/g)){

   const confEntry = new DevType(myId,myName,mac,myRegexp);
   this.config.push(confEntry);
   return confEntry;
   }else{
     return 'Invalid data';
   }


  }


};


module.exports = new ConfigTools();
