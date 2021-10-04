const dotenv = require('dotenv'); 
const winston = require('winston');
const app = require('./app');
const dbConnect = require('./config/db');
const cloudinary = require('cloudinary').v2;

//Error handler for uncaught exceptions
process.on('uncaughtException', (err) => {
    console.log(`ERROR: ${err.stack}`);
    console.log('Shutting down due to uncaught exception');
});  
 
//Set up the config file
dotenv.config({ path: "backend/config/config.env" })

//Set up the database connection
dbConnect();

//cloudinary configuration for images
cloudinary.config({ 
    cloud_name: process.env.CLOUDINARY_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
    secure: true
})

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
