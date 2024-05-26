require("dotenv").config();
const mongoose = require("mongoose");
const dbUrl = process.env.dbURL;

module.exports = {
  connectToDB: function () {
    mongoose.connect(dbUrl, {
        useNewUrlParser: true,
        useUnifiedTopology: true
      })
      .then(() => {
        console.log("Connected to the database");
      })
      .catch((err) => {
        console.error("Error in connecting to the database:", err);
      });
  }
};



