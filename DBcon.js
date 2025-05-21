const mysql = require('mysql');

const pool = mysql.createConnection({
    connectionLimit :  10,
    host     : '202.28.34.197',
    user     : 'ts_66011212013',
    password : '66011212013@csmsu',
    database : 'ts_66011212013'
  });
   
module.exports = pool;

//การผูก connection by pool