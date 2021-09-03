const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const { registerUser, 
        loginUser, 
        forgotPassword, 
        resetPassword, 
        getUserProfile,
        updatePassword,
        updateUserProfile,
        logoutUser,
        getAllUsers,
        getUserDetails,
        updateUser,
        deleteUser 
    } = require('../controllers/userController');

const { isUserAuthenticated, isUserAuthorized } = require('../middlewares/authUser');

router.route('/register').post(registerUser);

router.route('/login').post(loginUser);

router.route('/password/forgot').post(forgotPassword)

router.route('/password/reset/:token').put(resetPassword)

router.route('/logout').get(logoutUser);

router.route('/me').get(isUserAuthenticated, getUserProfile);

router.route('/password/update').put(isUserAuthenticated, updatePassword);

router.route('/me/update').put(isUserAuthenticated, updateUserProfile);

router.route('/admin/users').get(isUserAuthenticated, isUserAuthorized('admin'), getAllUsers);

router.route('/admin/user/:id').get(isUserAuthenticated, isUserAuthorized('admin'), getUserDetails);

router.route('/admin/update/:id').put(isUserAuthenticated, isUserAuthorized('admin'), updateUser);

router.route('/admin/delete/:id').delete(isUserAuthenticated, isUserAuthorized('admin'), deleteUser);

module.exports = router;
