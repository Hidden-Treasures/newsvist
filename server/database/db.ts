const mongoose = require("mongoose");

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("DB connection is successful!");
  })
  .catch((ex: any) => {
    console.log("DB connection failed: ", ex);
  });
