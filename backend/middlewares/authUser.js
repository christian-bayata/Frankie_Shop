require('express-async-errors');
const ErrorHandler = require('../utils/errorHandler');
const jwt = require('jsonwebtoken');
const User = require('../models/user');

const isUserAuthenticated = async function(req, res, next) {
    const token = req.cookies.token;

    if(!token) {
        return next(new ErrorHandler('Please login first', 401))
    }
    try {
        const decoded = jwt.verify(token, process.env.JWT_PRIVATEKEY);
        req.user = await User.findById(decoded.id);
        return next()
    }
    catch(err) {
        return next(new ErrorHandler('You are not authorized', 401));
    }  
};

const isUserAuthorized = function (...roles) {
    return (req, res, next) => {
        if(!roles.includes(req.user.role)) {
            return next(new ErrorHandler(`Role ${req.user.role} is not permitted to access this resource`, 403))
        };
        next()
    }
};

exports.isUserAuthenticated = isUserAuthenticated;
exports.isUserAuthorized = isUserAuthorized;