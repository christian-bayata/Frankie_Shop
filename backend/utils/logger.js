const winston = require('winston');

const logger = () => {
    winston.add(new winston.transports.File({
        filename: 'uncaughtExceptions.log',
        handleExceptions: true,
        level: 'error',
        format: winston.format.json()
    }));
    
    winston.add(new winston.transports.Console({
        handleExceptions: true,
        level: 'info',
        format: winston.format.combine(
            winston.format.colorize(),
            winston.format.simple()
    )}));
    
    winston.add(new winston.transports.File({
        filename: 'unhandledRejections.log',
        unhandledRejections: true,
    }));   
}

module.exports = logger;