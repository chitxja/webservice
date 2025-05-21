const express = require('express');
const router = express.Router();
const pool = require('./../../DBcon');
const mysql = require('mysql');

router.post('/:cusid', (req,res)=>{
    //ลูกค้าสามารถดูรถเข็นทั้งหมดทุกคันของตน โดยต้องแสดงข้อมูลรายละเอียดของสินค้า จำนวนสั่งซื้อ ราคาของแต่ละรายการ ในรถเข็นแต่ละคันออกมา  ซึ่งมีการเรียกเส้น API เส้นเดียวและส่ง *customer_id* เป็นข้อมูลเข้า
    let cusid = req.params.cusid;
    let sql = 'SELECT cart.cart_name , product.product_name, product.description ,cart_item.quantity, product.price FROM cart_item INNER JOIN product ON product.product_id = cart_item.product_id INNER JOIN cart ON cart.cart_id = cart_item.cart_id where customer_id = ?';
    sql = mysql.format(sql, [cusid]);
    pool.query(sql, (error, result)=>{
        if (result) {
            res.status(200).json({"Your product in cart" : result});
        }
    });
});

module.exports = router;