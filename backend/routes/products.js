const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const  {isUserAuthenticated, isUserAuthorized}  = require('../middlewares/authUser'); 

const { getProducts, 
        createProduct, 
        getProductById, 
        updateProduct, 
        deleteProduct, 
        createProductReview,
        getProductReviews,
        deleteReviews
    } = require('../controllers/productController')


router.route('/products').get(getProducts);

router.route('/product/:id').get(getProductById);

router.route('/admin/products/new').post(isUserAuthenticated, isUserAuthorized('admin'), createProduct);

router.route('/admin/products/:id')
    .put(isUserAuthenticated, isUserAuthorized('admin'), updateProduct)
    .delete(isUserAuthenticated, isUserAuthorized('admin'), deleteProduct);

router.route('/review').put(isUserAuthenticated, createProductReview);
router.route('/reviews').get(isUserAuthenticated, getProductReviews);
router.route('/reviews').delete(isUserAuthenticated, deleteReviews);

module.exports = router;