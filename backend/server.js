const winston = require('winston');
const app = require('./app');
const dbConnect = require('./config/db');
const dotenv = require('dotenv'); 

//Error handler for uncaught exceptions
process.on('uncaughtException', (err) => {
    console.log(`ERROR: ${err.stack}`);
    console.log('Shutting down due to uncaught exception');
});
 
//Set up the config file
dotenv.config({ path: "backend/config/config.env" })

//Set up the database connection
dbConnect();

const port = process.env.PORT;
const environment = process.env.NODE_ENV;
const server = app.listen(port, () => console.log(`Server is running on port ${port} in ${environment} mode`)); 

//Error handler for unhandled rejections
process.on('unhandledRejection', (err) => {
    console.log(`ERROR: ${err.stack}`);
    console.log('Shutting down due to unhandled rejections');
    server.close(() => {
        process.exit(1)
    })
});