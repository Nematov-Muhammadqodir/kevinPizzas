import dotenv from "dotenv";
dotenv.config();
import mongoose from "mongoose";
import app from "./app";

const url = process.env.MONGODB_URL;

mongoose
  .connect(url as string, {})
  .then((data) => {
    console.log("MongoDB connection succeed");
    const PORT = process.env.PORT;
    app.listen(PORT, () => {
      console.log(`The server is running on port: ${PORT}`);
    });
  })
  .catch((err) => {
    console.log("MongoDB connection failed!", err);
  });
