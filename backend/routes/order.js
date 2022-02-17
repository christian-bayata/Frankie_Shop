const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const {
  createOrder,
  getSingleOrder,
  myOrder,
  getAllOrders,
  updateOrder,
  deleteOrder,
} = require("../controllers/orderController");

const {
  isUserAuthenticated,
  isUserAuthorized,
} = require("../middlewares/authUser");

router.route("/order/new").post(isUserAuthenticated, createOrder);

router.route("/order/:id").get(isUserAuthenticated, getSingleOrder);

router.route("/orders/me").get(isUserAuthenticated, myOrder);

router
  .route("/admin/orders")
  .get(isUserAuthenticated, isUserAuthorized("admin"), getAllOrders);

router
  .route("/admin/order/:id")
  .put(isUserAuthenticated, isUserAuthorized("admin"), updateOrder)
  .delete(isUserAuthenticated, isUserAuthorized("admin"), deleteOrder);

module.exports = router;
