const express = require('express');
const router = express.Router();
const pool = require('../../DBcon');
const mysql = require('mysql');

router.post('/', (req,res) =>{
    let data = req.body;

    let sql = 'SELECT * FROM product WHERE description like ? AND price BETWEEN ? AND ?'; 
    sql = mysql.format(sql, [`%${data.description}%`,data.minprice, data.maxprice]);

    pool.query(sql, (error, result) =>{
        if (result.length === 0) {
           return res.status(400).json("don't have product");
            
        }
        
        let product = result[0];
        if (product) {
            
            return res.status(200).json(result);
        }
        

    });
    
});

module.exports = router;