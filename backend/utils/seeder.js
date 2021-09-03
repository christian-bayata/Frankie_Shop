const Product = require('../models/products');
const dotenv = require('dotenv');
const dbConnect = require('../config/db');
const productData = require('../data/product')

//Set up the config file
dotenv.config({ path: "backend/config/config.env" })

//Set up the database connection
dbConnect();

//Create a function to seed the JSON files
const seedProducts = async () => {

    try {
        await Product.deleteMany();
        console.log('All data in the database are deleted');
    
        await Product.insertMany(productData);
        console.log('The database is populated with all the data');
    
        process.exit(); 
    }
    catch(err) {
        console.log(err.message);
        process.exit();
    }
}

seedProducts();