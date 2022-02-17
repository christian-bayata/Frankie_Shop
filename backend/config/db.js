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
