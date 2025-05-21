const bcrypt = require('bcrypt');
const express = require('express');
const router = express.Router();
const pool = require('../../DBcon');
const mysql = require('mysql');
const { json } = require('body-parser');
const mergeJSON = require('merge-json');


router.put('/', async (req, res) => {
    let data = req.body;
    let email = data.email;

    let oldsql = 'SELECT * FROM customer WHERE email = ?'
    oldsql = mysql.format(oldsql, [email]);


    pool.query(oldsql, async (error, results, fields) => {

        if (error) throw error;
        let olddata = results[0];
        let jsondata = JSON.parse(JSON.stringify(olddata));//แปลง olddata -> js

        let isMatch = await bcrypt.compare(data.oldpassword, jsondata.password);
        if (!isMatch) {
            return res.status(404).json({ message: "password is not match" });

        }
        // console.log(newpassword);
        let newdata = mergeJSON.merge(jsondata, data);
        let newpassword = await bcrypt.hash(newdata.password, 10);
        // console.log(newpassword);
        // return res.status(201).json({ message: "password is  match" ,olddata,newpassword});

        let updatepwd = 'UPDATE customer SET first_name = ?, last_name = ?, email = ?, phone_number = ?, address = ?, password = ? WHERE email = ?';
        updatepwd = mysql.format(updatepwd, [newdata.first_name, newdata.last_name, newdata.email, newdata.phone_number, newdata.address, newpassword, email]);

        pool.query(updatepwd, (updatefalse, updatesucc) => {
            if (updatefalse) {
                console.error('MySQL Update Error:', updatefalse);
                return res.status(500).json({ message: "Failed to update user", updatefalse });
            }


            if (updatesucc.affectedRows === 1) {
                return res.status(200).json({
                    messsage: "update succes",
                    updatesucc,
                    newpassword,
                    olddata,
                    updatefalse
                });
            }
            return res.status(404).json({
                message: "No rows affected, update failed",

            });


        });




    });
});

module.exports = router;