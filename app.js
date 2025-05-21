const express = require('express');
const app = express();


const indexRouter = require('./api/router/index');
const custumersRouter = require('./api/router/custumers');
const loginPost = require('./api/router/login');
const changPWD = require('./api/router/changPWD');
const searchProduct = require('./api/router/searchProduct');
const Shop = require('./api/router/Shop');
const searchcart = require('./api/router/searchcart');
const bodyparser = require('body-parser');  


app.use(bodyparser.json());
app.use('/',indexRouter);
app.use('/custumers',custumersRouter);
app.use('/login',loginPost);
app.use('/chpwd',changPWD);
app.use('/searchProduct',searchProduct);
app.use('/Shop',Shop);
app.use('/searchcart',searchcart);

module.exports = app;