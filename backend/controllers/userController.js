require('express-async-errors');
const ErrorHandler = require('../utils/errorHandler'); 
const User = require('../models/user');
const storeToken = require('../utils/storeToken');
const sendEmail = require('../utils/sendEmail');
const crypto = require('crypto');
const cloudinary = require('cloudinary').v2;

//USERS.....

//Create a new user         => /api/register
const registerUser = async (req, res, next) => { 

    
    const { name, email, password } = req.body;
    
     user = await User.create({
        name,
        email,
        password,
        avatar: {
            public_id: "Products/1_3_adb542ad-6d55-46a7-8217-8b5ccc89123b_2048x2048_hlcayj.jpg",
            url: "https://res.cloudinary.com/bayata/image/upload/v1630413918/Products/1_3_adb542ad-6d55-46a7-8217-8b5ccc89123b_2048x2048_hlcayj.jpg"
        }
    });

    storeToken(user, 200, res);
}

//Route for logging in a user           => /api/login
const loginUser = async (req, res, next) => {
    const { email, password } = req.body;

    //Validate user input: email and password;
    if(!email || !password) {
        return next(new ErrorHandler('Please enter your email and password', 400));
    };
    // Check if the email exists in the database
    const user = await User.findOne({ email }).select('+password');
    if(!user) return next(new ErrorHandler('Invalid email or password', 401));

    //Check if the user entered a matching password or not
    const matchingPassword = await user.comparePassword(password);
    if(!matchingPassword) return next(new ErrorHandler('Invalid email and password', 401));

    storeToken(user, 200, res);
};


//Route for forgot password          ==> /api/password/forgot
const forgotPassword = async (req, res, next) => {
    const user = await User.findOne({ email: req.body.email });

    if(!user) return next(new ErrorHandler('User with this email is not found', 404));

    //send a new password token to user
    const resetToken = user.getResetPasswordToken();
     
    await user.save({ validateBeforeSave: false });
    
    //Create reset password url
    const resetUrl = `${process.env.FRONTEND_URL}/password/reset/${resetToken}`; 

    //Set the password reset email message for client 
    const message = `This is your password reset token: \n\n${resetUrl}\n\nIf you have not requested this email, then ignore it`

    //The reset token email
    try {
        await sendEmail({
            email: user.email,
            subject: 'Frankie-Shop Password recovery',
            message
        })

    res.status(200).json({
        success: true,
        message: `Recovery email sent to ${user.email}` 
    })
    }
    catch(err) {
        user.resetPasswordToken = undefined;
        user.resetPasswordExpires = undefined;

        await user.save({ validateBeforeSave: false });

        return next(new ErrorHandler(err.message, 500));
    }
} 

//Route for reset password          ==> /api/password/reset
const resetPassword = async (req, res, next) => {
    //hash the reset password token
    const resetPasswordToken = crypto.createHash('sha256').update(req.params.token).digest('hex');

    //Check to see if user with this password exists
    const user = await User.findOne({ 
        resetPasswordToken, 
        resetPasswordExpires: { $gt: Date.now() }
    });

    if(!user) return next(new ErrorHandler('Password reset token is invalid or has expired', 400));

    //Confirm if the password matches 
    if(req.body.password !== req.body.confirmPassword) {
        return next(new ErrorHandler('Password does not match', 400));
    }
    //If password matches
    user.password = req.body.password;

    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;

    await user.save();

    storeToken(user, 200, res);
};

//Route for getting the currently logged in user details          ==> /api/me
const getUserProfile = async (req, res, next) => {
    const user = await User.findById(req.user.id);

    res.status(200).json({
        success: true,
        user
    });
};

//Route for updating user password          ==> /api/password/update
const updatePassword = async (req, res, next) => {
    const user = await User.findById(req.user.id).select('+password');

    //Check for the old user password 
    const isPasswordMatched = user.comparePassword(req.body.oldPassword);

    if(!isPasswordMatched) {
        return next(new ErrorHandler('Old password is incorrect', 400)); 
    };

    user.password = req.body.password;
    await user.save();

    storeToken(user, 200, res);
};

//Route for updating user profile logged    ==> /api/me/update
const updateUserProfile = async (req, res, next) => {
    
    //Create the user profile 
    const newUserProfile = {
        name: req.body.name,
        email: req.body.email
    };

    //update user avatar
    if(req.body.avatar !== '') {
        const user = await User.findById(req.user.id);
 
        const image_id = user.avatar.public_id;
        const res = cloudinary.uploader.destroy(image_id);

        const result = await cloudinary.uploader.upload(req.body.avatar, {
            folder: 'avatar',
            width: 150,
            crop: 'scale'
        });

        newUserProfile.avatar = {
            public_id: result.public_id,
            url: result.secure_url
        }
    }

    const user = await User.findByIdAndUpdate(req.user.id, newUserProfile, {
        new: true,
        runValidators: true,
        useFindAndModify: false
    });

    res.status(200).json({
        success: true
    });
};

//Route for logging out a user          ==> /api/logout
const logoutUser = async (req, res, next) => {
    const cookieOptions = {
        expires: new Date(Date.now),
        httpOnly: true
    }

    res.status(200).cookie('token', null, cookieOptions).json({
        success: true,
        message: "Logged Out"
    })
}

//ADMIN .......

//Admin route for getting all the users       ==> /api/admin/users
const getAllUsers = async (req, res, next) => {
    const users = await User.find().sort('name');

    res.status(200).json({
        success: true,
        users
    });
};

//Admin route for getting user details          ==> /api/admin/user/:id
const getUserDetails = async (req, res, next) => {
    const user = await User.findById(req.params.id);

    if(!user) return next(new ErrorHandler(`User with the ID: ${req.params.id} does not exist`, 404))

    res.status(200).json({
        success: true,
        user
    });
};

//Admin route for updating user          ==> /api/admin/update/:id
const updateUser = async (req, res, next) => {
    const userDetails = {
        name: req.body.name,
        email: req.body.email,
        role: req.body.role
    }; 
    
    const user = await User.findById(req.params.id);

    if(!user) return next(new ErrorHandler(`User with the ID: ${req.params.id} does not exist`, 404));

    await User.findByIdAndUpdate(req.params.id, userDetails, {
        new: true,
        usevalidators: true,
        useFindAndModify: false
    });

    res.status(200).json({
        success: true
    });
};

//Admin route for deleting user         ==> /api/admin/delete/:id
const deleteUser = async (req, res, next) => {
    const user = await User.findById(req.params.id);

    if(!user) return next(new ErrorHandler(`User with the ID: ${req.params.id} does not exist`, 404));

    await User.deleteOne();

    res.status(200).json({
        success: true,
        message: `User with ID: ${req.params.id} is deleted`
    });
}; 

module.exports = {
    logoutUser,
    loginUser,
    registerUser, 
    forgotPassword,
    resetPassword,
    getUserProfile,
    updatePassword,
    updateUserProfile,
    getAllUsers,
    getUserDetails,
    updateUser,
    deleteUser
};
