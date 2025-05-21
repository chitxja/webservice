const express = require('express');
const router = express.Router();
const pool = require('./../../DBcon')
const mysql = require('mysql');
const bodyParser = require('body-parser');
const mergeJSON = require('merge-json');

router.put('/:cusid', (req, res) => {
    let data = req.body;
    let cusid = req.params.cusid;

    //1.check cart 
    let sql = 'SELECT * FROM cart WHERE cart_name = ? AND customer_id = ?';
    sql = mysql.format(sql, [data.cart_name, cusid]);


    pool.query(sql, (error, result) => {
        let cart = result[0];
        if (!cart) {
            // res.status(200).json("new cart");
            let addcart = 'INSERT INTO cart (customer_id, cart_name) VALUES (?,?)';
            addcart = mysql.format(addcart, [cusid, data.cart_name]);
            pool.query(addcart, (error, result) => {
                if (result) {
                    res.status(200).json("you have new cart_name " + data.cart_name + " pls enter again for add product.");
                }
            });

        }
        //2.check product in cart_item?

        let cart_id = cart.cart_id;
        let chproduct = 'SELECT * FROM cart_item INNER JOIN product ON product.product_id = cart_item.product_id where product.product_name = ? AND cart_item.cart_id = ?';
        chproduct = mysql.format(chproduct, [data.add_product_name, cart_id]);
        pool.query(chproduct, (error, result) => {
            let chproduct = result[0];
            // console.log(chproduct);    
            if (chproduct) {
                // res.status(200).json("you have product in cart");
                //update quantity
                let olddata = JSON.parse(JSON.stringify(chproduct));
                let newdata = mergeJSON.merge(olddata, data);
                // console.log(newdata);
                let quantity = data.qquantity;
                let sumquantity = Number(newdata.quantity) + Number(quantity);
                // console.log(sumquantity);
                let updatequantity = 'UPDATE cart_item SET quantity = ? WHERE cart_id = ? AND product_id = ?';
                updatequantity = mysql.format(updatequantity, [sumquantity,cart_id, newdata.product_id]);
                pool.query(updatequantity, (error, result) => {
                    if (result) {
                        res.status(201).json({ message: "you add product " + data.add_product_name + " quantity : " + sumquantity });

                    }
                });

            }
            if (!chproduct) {

                let checkproduct = 'SELECT * FROM product WHERE product_name = ?';
                checkproduct = mysql.format(checkproduct, [data.add_product_name]);
                pool.query(checkproduct, (error, result) => {
                    let product = result[0];
                    if (!product) {
                        let tatal = 'SELECT product_name FROM product ';
                        tatal = mysql.format(tatal);
                        pool.query(tatal, (error, result) => {
                            res.status(201).json({ message: "Product don't have in stock.", total_product: result });

                        });

                    }
                    if (product) {

                        let product_id = product.product_id
                        // console.log(product_id);
                        let addproduct = 'INSERT INTO cart_item (cart_id, product_id, quantity) VALUE (?,?,?)';
                        addproduct = mysql.format(addproduct, [cart_id, product_id, data.qquantity]);
                        pool.query(addproduct, (error, result) => {

                            if (result) {

                                res.status(200).json("insert success", result);
                            }
                            if (error) return res.status(500).json({ error });
                        });

                    }
                });

            }

        });
        // console.log(jsondata);

        // }


    });

});

module.exports = router;

