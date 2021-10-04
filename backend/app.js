const winston = require('winston');
const express = require('express');
const app = express();
const cookieParser = require('cookie-parser');  
const logger = require('./utils/logger'); 
const products = require('./routes/products');
const user = require('./routes/user');
const order = require('./routes/order');
const error = require('./middlewares/errors.js');
const fileUpload = require('express-fileupload');

 
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(fileUpload({ useTempFiles: true }));

//Winston Logger 
logger();
 
//Routes
app.use('/api/', products);
app.use('/api/', user);
app.use('/api/', order);
 
//Error Handler Middleware
app.use(error);

module.exports = app;