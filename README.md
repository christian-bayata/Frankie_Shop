# Frankie-Shop-E-commerce-API

> API that allows users to order and buy products, and make reviews based on interests.

| PROJECT FEATURES                        |         STATUS          |
| :-------------------------------------- | :---------------------: |
| User Register                           | :ballot_box_with_check: |
| User Login                              | :ballot_box_with_check: |
| Order Products                          | :ballot_box_with_check: |
| Make Payments                           | :ballot_box_with_check: |
| Pagination                              | :ballot_box_with_check: |
| Search (using query strings with Regex) | :ballot_box_with_check: |

- :key: User Authentication with [JWT](https://jwt.io/)
- :earth_africa: Routes with [express-router](https://expressjs.com/en/guide/routing.html)
- Background operations are sponsored via [frankie-shop-api-service](https://github.com/christian-bayata/Frankie_Shop.git). This is a public repo, however, there are some basic requirements needed to run it on your platform.
- Uses [MongoDB](https://www.mongodb.com) as database.
- Uses [Mongoose](https://mongoosejs.com) as object document model.
- Integrated using all 3 environments: `development`, `testing`, and `production`.
- Built with [npm scripts](#npm-scripts).
- example for User model and User controller, with jwt authentication, simply type `npm run dev`.

## Table of Content

- [Install and Use](#install-and-use)
- [Folder Structure](#folder-structure)
- [Config](#Database)
- [Controllers](#controllers)
  - [Create a Controller](#create-a-controller)
- [Middlewares](#middlewares)
  - [authUser.middleware](#authUserMiddleware)
- [Models](#models)
  - [Create a Model](#create-a-model)
- [Routes](#routes)
  - [Create Routes](#create-routes)

## Install and Use

Begin by cloning this repository:

```sh
    #HTTPS
    $ git clone https://github.com/christian-bayata/Frankie_Shop.git
```

then do this aferwards:

```sh
   #cd into the root Folder
   $ npm install
   $ npm run dev
```

## Folder Structure

The codebase has the following directories:

- config - for internal configurations, including environment variables and database setting.
- controllers - contains all the links between the routes and server for easy RESTful APIs.
- middlewares - contains all middleware functions for authorization, authorization and error.
- models - contains database schema definitions and models creation.
- routes - contains all client requests that are handled by application endpoints.
- utils - contains functions that are often used in the codebase.

## Config

Contains all internal system configurations, including the database connection.

## Database

> Note: if you use MongoDB, please ensure that mongodb server is running on the machine.
> The code creates a connection to a database.
> The "databaseURI" works with environment variables that can be seen in the app file

```js
const mongoose = require("mongoose");

const dbConnect = async (databaseURI) => {
  try {
    await mongoose
      .connect(databaseURI, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useFindAndModify: false,
        useCreateIndex: true,
      })
      .then(() => console.log(`Database is connected to ${databaseURI}`));
  } catch (err) {
    console.log("Could not connect to the database", err);
    process.exit(1);
  }
};

module.exports = dbConnect;
```

## Controllers

Contains all the code that serve as link between the server and routes. The naming convention it bears is usually `model name` plus `Controller`,e.g: `productController.js` in a camel-casing naming format.

## Create a controller

Here are snapshots of Controllers used for **CRUD** in the project:

```js
require("express-async-errors");
const ErrorHandler = require("../utils/errorHandler");
const User = require("../models/user");
const storeToken = require("../utils/storeToken");
const sendEmail = require("../utils/sendEmail");
const crypto = require("crypto");

//USERS.....

//Create a new user         => /api/register
const registerUser = async (req, res, next) => {
  const { name, email, password } = req.body;

  const user = await User.create({
    name,
    email,
    password,
    avatar: {
      public_id: result.public_id,
      url: result.secure_url,
    },
  });

  storeToken(user, 200, res);
};

//Route for logging in a user           => /api/login
const loginUser = async (req, res, next) => {
  const { email, password } = req.body;

  //Validate user input: email and password;
  if (!email || !password) {
    return next(new ErrorHandler("Please enter your email and password", 400));
  }
  // Check if the email exists in the database
  const user = await User.findOne({ email }).select("+password");
  if (!user) return next(new ErrorHandler("Invalid email or password", 401));

  //Check if the user entered a matching password or not
  const matchingPassword = await user.comparePassword(password);
  if (!matchingPassword)
    return next(new ErrorHandler("Invalid email and password", 401));

  storeToken(user, 200, res);
};

//Route for forgot password          ==> /api/password/forgot
const forgotPassword = async (req, res, next) => {
  const user = await User.findOne({ email: req.body.email });

  if (!user)
    return next(new ErrorHandler("User with this email is not found", 404));

  //send a new password token to user
  const resetToken = user.getResetPasswordToken();

  await user.save({ validateBeforeSave: false });

  //Create reset password url
  const resetUrl = `${req.protocol}://${req.get(
    "host"
  )}/api/password/reset/${resetToken}`;

  //Set the password reset email message for client
  const message = `This is your password reset token: \n\n${resetUrl}\n\nIf you have not requested this email, then ignore it`;

  //The reset token email
  try {
    await sendEmail({
      email: user.email,
      subject: "Frankie-Shop Password recovery",
      message,
    });

    res.status(200).json({
      success: true,
      message: `Recovery email sent to ${user.email}`,
    });
  } catch (err) {
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;

    await user.save({ validateBeforeSave: false });

    return next(new ErrorHandler(err.message, 500));
  }
};

//Route for reset password          ==> /api/password/reset
const resetPassword = async (req, res, next) => {
  //hash the reset password token
  const resetPasswordToken = crypto
    .createHash("sha256")
    .update(req.params.token)
    .digest("hex");

  //Check to see if user with this password exists
  const user = await User.findOne({
    resetPasswordToken,
    resetPasswordExpires: { $gt: Date.now() },
  });

  if (!user)
    return next(
      new ErrorHandler("Password reset token is invalid or has expired", 400)
    );

  //Confirm if the password matches
  if (req.body.password !== req.body.confirmPassword) {
    return next(new ErrorHandler("Password does not match", 400));
  }
  //If password matches
  user.password = req.body.password;

  user.resetPasswordToken = undefined;
  user.resetPasswordExpires = undefined;

  await user.save();

  storeToken(user, 200, res);
};
```

## Middlewares

Middlewares are functions are passed in between routes before making a request.
For instance, this is a middleware that enables users login before getting access to any resource.

```js
require("express-async-errors");
const ErrorHandler = require("../utils/errorHandler");
const jwt = require("jsonwebtoken");
const User = require("../models/user");

const isUserAuthenticated = async function (req, res, next) {
  const token = req.cookies.token;

  if (!token) {
    return next(new ErrorHandler("Please login first", 401));
  }
  try {
    const decoded = jwt.verify(token, process.env.JWT_PRIVATEKEY);
    req.user = await User.findById(decoded.id);
    return next();
  } catch (err) {
    return next(new ErrorHandler("You are not authorized", 401));
  }
};
```

This middleware function is used on routes in this manner:

```js
const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");

const {
  isUserAuthenticated,
  isUserAuthorized,
} = require("../middlewares/authUser");

router.route("/me").get(isUserAuthenticated, getUserProfile);

router.route("/password/update").put(isUserAuthenticated, updatePassword);

router.route("/me/update").put(isUserAuthenticated, updateUserProfile);

router
  .route("/admin/users")
  .get(isUserAuthenticated, isUserAuthorized("admin"), getAllUsers);

router
  .route("/admin/user/:id")
  .get(isUserAuthenticated, isUserAuthorized("admin"), getUserDetails);

router
  .route("/admin/update/:id")
  .put(isUserAuthenticated, isUserAuthorized("admin"), updateUser);

router
  .route("/admin/delete/:id")
  .delete(isUserAuthenticated, isUserAuthorized("admin"), deleteUser);

module.exports = router;
```

## Models

We use [Mongoose](https://mongoosejs.com) to define our Models, and the naming convention is usually `Modelname.js`.
For more information, check out the [Docs](https://mongoosejs.com/docs/guide.html).

## Create a Model

For instance, here is a user model below:

```js
const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    maxlength: [30, "Name cannot exceed 30 characters"],
    required: true,
  },
  email: {
    type: String,
    validate: [validator.isEmail, "Please enter a valid email address"],
    required: [true, "Please enter your email"],
    unique: true,
  },
  password: {
    type: String,
    required: [true, "Please enter your password"],
    minlength: [6, "Password must be longer than 6 characters"],
    select: false,
  },
  avatar: {
    public_id: {
      type: String,
      required: true,
    },
    url: {
      type: String,
      required: true,
    },
  },
  role: {
    type: String,
    default: "User",
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  resetPasswordToken: String,
  resetPasswordExpires: Date,
});

//Hash the password before storing it in the database
userSchema.pre("save", async function save(next) {
  try {
    if (!this.isModified("password")) return next();

    this.password = await bcrypt.hash(this.password, 10);
  } catch (err) {
    return next(err);
  }
});

//generate authentication token for registered user
userSchema.methods.generateAuthToken = function () {
  const token = jwt.sign({ id: this._id }, process.env.JWT_PRIVATEKEY, {
    expiresIn: process.env.JWT_EXPIRATION_TIME,
  });
  return token;
};

//Compare password using bcrypt.compare
userSchema.methods.comparePassword = async function (userPassword) {
  return await bcrypt.compare(userPassword, this.password);
};

//Reset forgotten password using crypto
userSchema.methods.getResetPasswordToken = function () {
  //Generate crypto token
  const resetToken = crypto.randomBytes(20).toString("hex");

  //Encrypt the token and set it to resetPasswordToken
  this.resetPasswordToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");

  //Set the token expiry time to 30 mins
  this.resetPasswordExpires = Date.now() + 30 * 60 * 1000;

  return resetToken;
};

module.exports = mongoose.model("User", userSchema);
```

> Note: You can use custom mongoose validations (which I used) in your models, or you can use the npm package module, [Joi](https://joi.dev/api/?v=17.4.2).
