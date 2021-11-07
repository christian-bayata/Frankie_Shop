const winston = require('winston');
const app = require('./app');
const dbConnect = require('./config/db');
const dotenv = require('dotenv'); 
const cloudinary = require('cloudinary');

//Error handler for uncaught exceptions
process.on('uncaughtException', (err) => {
    console.log(`ERROR: ${err.stack}`);
    console.log('Shutting down due to uncaught exception');
});
 
//Set up the config file
dotenv.config({ path: "backend/config/config.env" })

//Set up the database connection
let databaseURI = process.env.DB_LOCAL_URI;
if(process.env.NODE_ENV === "test") databaseURI = process.env.DB_TEST_URI;
dbConnect(databaseURI).then(() => true);

//cloudinary configuration for images
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
})

const port = process.env.PORT;
const environment = process.env.NODE_ENV;
let server = app.listen(port, () => console.log(`Server is running on port ${port} in ${environment} mode`));

//Error handler for unhandled rejections
process.on('unhandledRejection', (err) => {
    console.log(`ERROR: ${err.stack}`);
    console.log('Shutting down due to unhandled rejections');
    server.close(() => {
        process.exit(1)
    }) 
});

module.exports = server;