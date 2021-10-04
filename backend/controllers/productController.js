require('express-async-errors');
const Product = require('../models/products');
const User = require('../models/user');
const errorHandler = require('../utils/errorHandler'); 
const APIFeatures = require('../utils/apiFeatures'); 


//Gets all the products in the database   =>    /api/products/
exports.getProducts = async (req, res, next) => {
      
    const resPerPage = 4;
    const productCount = await Product.countDocuments()
 
    let apiFeatures = new APIFeatures(Product.find(), req.query)
    .search()
    .filter()
    
    let products = await apiFeatures.query;
    let filteredProductsCount = products.length;
 
    apiFeatures.pagination(resPerPage);
    products = await apiFeatures.query;

    res.status(200).json({
    success: true,
    productCount,
    resPerPage,
    filteredProductsCount,
    products
    });
};

//Gets a single product from the database   =>    /api/product/id
exports.getProductById = async (req, res, next) => {
    const product = await Product.findById(req.params.id);
    if(!product) {
        return next(new errorHandler('product not found', 404));
    }

    res.status(200).json({
        success: true,
        product
    });
};

//Creates a new product(s)   =>     /api/admin/products/new 
exports.createProduct = async (req, res, next) => {

    const user = await User.findById(req.user._id);
    req.body.user = user
    
    const product = await Product.create(req.body);

    res.status(201).json({
        success: true,
        product
    });
};
 
//Updates a product in the database   =>    /api/admin/products/id
exports.updateProduct = async (req, res, next) => {
    let product = await Product.findById(req.params.id);
    if(!product) {
        return next(new errorHandler('product not found', 404));
    };

    product = await Product.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true,
        useFindAndModify: false
    });

    res.status(200).json({
        "success": true,
        product
    });  
};

//Deletes a product from the database   =>    /api/admin/products/id
exports.deleteProduct = async (req, res, next) => {
    let product = await Product.findById(req.params.id);
    if(!product) {
        return next(new errorHandler('product not found', 404));
    }
    
    await Product.deleteOne();

    res.status(200).json({
        "success": true,
        "message": "The product has been deleted"
    });
};

//Review Products ....................................................

//Route for creating a new product review and rating      ==> /api/reviews
exports.createProductReview = async (req, res, next) => {
    const { rating, comment, productId } = req.body;
    
    const user = await User.findById(req.user._id);
    req.body.user = user;

    const review = {
        user: req.user._id,
        name: req.user.name,
        rating: Number(rating),
        comment 
    };

    const product = await Product.findById(productId);

    const isReviewed = product.reviews.find(
        r => r.user.toString() === req.user._id.toString()
    );

    if(isReviewed) {
        product.reviews.forEach((review) => {
            if(review.user.toString() === req.user._id.toString()) {
                review.comment = comment;
                review.rating = rating;
            }
        })
            
    }    
    else {
            product.reviews.push(review);
            product.numOfReviews = product.reviews.length
        }            

    //To get product rating, divide the overall product review by the overall product
    product.rating = product.reviews.reduce((acc, item) => item.rating + acc, 0) / product.reviews.length

    await product.save({ validateBeforeSave: false });
    
    res.status(200).json({
        success: true
    })
};

//Route for getting all the product reviews     ==> /api/reviews/
exports.getProductReviews = async (req, res, next) => {
    const product = await Product.findById(req.query.id);

    res.status(200).json({
        success: true,
        reviews: product.reviews
    });
};

//Route for deleting product reviews     ==> /api/reviews/
exports.deleteReviews = async (req, res, next) => {
    const product = await Product.findById(req.query.productId);

    const reviews = product.reviews.filter(review => review._id.toString() !== req.query.id.toString());

    const noOfReviews = reviews.length;
    
    const rating = product.reviews.reduce((acc, item) => item.rating + acc, 0) / reviews.length;

    await Product.findByIdAndUpdate(req.query.productId, {
        reviews,
        noOfReviews,
        rating
    }, {
        new: true,
        runValidators: true,
        useFindAndModify: false
    });

    res.status(200).json({
        success: true
    });
};