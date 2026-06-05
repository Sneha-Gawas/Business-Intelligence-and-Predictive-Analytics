import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();
const mongoURI = process.env.MONGO_URI;
export const connectDb=async function main() {
    await mongoose.connect(mongoURI)
    .then(()=>{
        console.log("Connected to db Successfully!")
    });
  }