'use strict';
var mysql = require('mysql');

var pool = mysql.createPool({
    host     : 'mysql',
    user     : 'ButtonUser',
    password : 'ButtonS3cretP@ssw0rd!',
    database : 'ButtonBase',
    port     : 3306
});

var i;
var callback;

module.exports = {

    query: function(){
        var sql_args = [];
        var args = [];
        for(i=0; i<arguments.length; i++){
            args.push(arguments[i]);
        }
        callback = args[args.length-1]; //last arg is callback
        pool.getConnection(function(err, connection) {
        if(err) {
                console.log(err);
                return callback(err);
            }
            if(args.length > 2){
                sql_args = args[1];
            }
        connection.query(args[0], sql_args, function(err, results) {
          connection.release(); // always put connection back in pool after last query
          if(err){
                    console.log(err);
                    return callback(err);
                }
          return callback(null, results);
        });
      });
    }
};
