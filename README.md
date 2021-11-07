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
- [npm Scripts](#npm-scripts)

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

##Database

> Note: if you use MongoDB, please ensure that mongodb server is running on the machine.
> The code creates a connection to a database.
> The "databaaseURI" works with environment variables that can

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
