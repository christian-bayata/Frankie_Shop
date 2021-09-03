const winston = require('winston');
const express = require('express');
const app = express();
const cookieParser = require('cookie-parser');  
const logger = require('./utils/logger');
const products = require('./routes/products');
const user = require('./routes/user');
const order = require('./routes/order');
const error = require('./middlewares/errors.js');

app.use(express.json());
app.use(cookieParser());

//Winston Logger
logger();

//Routes
app.use('/api/', products);
app.use('/api/', user);
app.use('/api/', order);

//Error Handler Middleware
app.use(error);

module.exports = app;