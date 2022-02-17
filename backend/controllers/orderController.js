require('express-async-errors');
const Order = require('../models/order');
const Product = require('../models/products');
const User = require('../models/user');
const ErrorHandler = require('../utils/errorHandler');
const mongoose = require('mongoose');

//USER................................................
//Route for creating a new order    ==> /api/order/new
const createOrder = async (req, res, next) => {
     
    const {     orderItems, 
                shippingInfo, 
                itemsPrice, 
                taxPrice,
                shippingPrice, 
                totalPrice, 
                paymentInfo,
            } = req.body;
    
    const user = await User.findById(req.user._id);
    if(!user) return next(new ErrorHandler('User with this ID not found', 404));
    
    const order = await Order.create({
            orderItems, 
            shippingInfo, 
            itemsPrice,
            taxPrice,
            shippingPrice,
            totalPrice,
            paymentInfo,
            paidAt: Date.now(), 
            user
        });

    res.status(200).json({
        success: true,
        message: "Successfully created a new order",
        order
    });                       
}

//Route for getting a single order      ==> /api/order/:id
const getSingleOrder = async (req, res, next) => {
    const order = await Order.findById(req.params.id).populate('user', 'name email');

    if(!order) return next(new ErrorHandler('Order not found with this ID', 404));

    res.status(200).json({
        success: true,
        order
    })
};

//Route for getting a logged-in user order      ==> /api/orders/me
const myOrder = async (req, res, next) => {
    const orders = await Order.find({ user: req.user._id });

    res.status(200).json({
        success: true,
        orders
    })
};

//ADMIN.............................................. 

//Route for getting all order    ==> /api/admin/order/
const getAllOrders = async (req, res, next) => {
    const orders = await Order.find();

    //Calculate the total Price
    let totalAmount = 0;

    orders.forEach(order => {
        totalAmount += order.totalPrice;
    })

    res.status(200).json({
        success: true,
        totalAmount,
        orders
    })
};

//Route for updating/processing all orders    ==> /api/admin/order/:id
const updateOrder = async (req, res, next) => {
    const order = await Order.findById(req.params.id);

    if(order.orderStatus === 'Delivered') {
    return next(new ErrorHandler('Your order has already been delivered', 400));
    };
    //Update the product and quantity available
    order.orderItems.forEach(async (item) => {
        await updateStock(item.product, item.quantity)
    });

    order.orderStatus = req.body.orderStatus;
    order.deliveredAt = Date.now();

    await order.save();
    
    res.status(200).json({
        success: "true"
    })
};

//Route for deleting a user order      ==> /api/admin/orders/:id
const deleteOrder = async (req, res, next) => {
    const order = await Order.findById(req.params.id);
    if(!order) return next(new ErrorHandler('The user with this ID is not found', 404))

    await order.deleteOne();

    res.status(200).json({
        success: true    
    })
};

module.exports = {
    createOrder,
    getSingleOrder,
    myOrder,
    getAllOrders,
    updateOrder,
    deleteOrder
}

const updateStock = async (id, quantity) => {
    const product = await Product.findById(id);

    //The remaining products in the stock is the product stock - the quantity bought by user
    product.stock = product.stock - quantity;

    await product.save({ validateBeforeSave: false });
}