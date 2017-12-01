'use strict';

module.exports = {


  ISODateString:function(d) {
      function pad(n) {
          return n < 10 ? '0' + n : n;
      }
      return d.getUTCFullYear() + '-' +
          pad(d.getUTCMonth() + 1) + '-' +
          pad(d.getUTCDate()) + ' ' +
          pad(d.getUTCHours()) + ':' +
          pad(d.getUTCMinutes()) + ':' +
          pad(d.getUTCSeconds());
  }
};
