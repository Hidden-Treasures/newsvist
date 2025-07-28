import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

mongoose
  .connect(process.env.MONGO_URI!)
  .then(() => {
    console.log("DB connection is successful!");
  })
  .catch((ex: any) => {
    console.log("DB connection failed: ", ex);
  });
