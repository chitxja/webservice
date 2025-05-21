const express = require('express');
const router = express.Router();
const pool = require('../../DBcon');
const mysql = require('mysql');


router.get('/', (req, res) => {

  // conn.connect();

  pool.query('SELECT * FROM customer', function (error, results, fields) {
    if (error) throw error;
    res.status(200).json(results);
  });

  // conn.end();
});

router.get('/:cusid', (req, res) => {
  let id = req.params.cusid;
  // pool.connect();

  pool.query('SELECT * FROM customer where customer_id =' + id, (error, results, fields) => {
    if (error) throw error;
    res.status(200).json(results);
  });

  // pool.end();
});
router.post('/', (req, res) => {
  let data = req.body;
  // let id = req.params.cusid;
  let sql = 'INSERT INTO customer (first_name, last_name, email, phone_number, address, password)' + 'VALUES (?, ?, ?, ?, ?,?)';
  sql = mysql.format(sql, [data.first_name, data.last_name, data.email, data.phone_number, data.address, data.password]);//send in รูแปปบ Array
  // pool.connect();

  pool.query(sql, (error, results, fields) => {
    if (error) throw error;
    if (results.affactedRows == 1){
      res.status(200).json(        {
          message: 'Insert success'
        });

    } else {
      res.status(400).json({
        message: 'Insert failed'
      });
    }
  });

  // pool.end();
});
module.exports = router;