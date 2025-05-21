const bcrypt = require('bcrypt');
const express = require('express');
const router = express.Router();
const pool = require('../../DBcon');
const mysql = require('mysql');


router.post('/', (req, res) => {
    let data = req.body;
    // let email = data.email;
    // let password = data.password;

    let sql = 'SELECT * FROM customer WHERE email = ?';
    sql = mysql.format(sql, [data.email]);


    pool.query(sql, async (error, results) => {
        if (error) throw error

        if (results.length === 0) {
            res.status(401).json({ message: "Invalid email or password" });
        }

        const user = results[0];
        const isMatch = await bcrypt.compare(data.password, user.password);

        if (isMatch) {
            const {password, ...userDetails} = user;
            res.status(200).json(userDetails);
        } else {
            res.status(401).json({ message: "Invalid email or password" });
        }

    });
});

module.exports = router;