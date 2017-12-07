'use strict';

class DevType {
  constructor(id, name, mac, regexp) {
    this.id = id;
    this.name = name;
    this.mac = mac;
    this.regexp = regexp;
    this.configured = false;
  }
}
module.exports = DevType;
