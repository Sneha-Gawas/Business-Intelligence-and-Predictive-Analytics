// models/Transaction.js
import { Schema } from "mongoose";
import mongoose from "mongoose";
const reviewsSchema = new mongoose.Schema({
  UserID: {
    type: Number,
    required: true,
    unique: true
  },
  Product: {
    type: String,
    required: true
  },
  Review: {
    type: String,
    required:true
  },
  Sentiment: {
    type: String,
    required: true
  },
  Ratings: {
    type:Number,
    required:true
  },
});
const Customer= mongoose.model("reviews",reviewsSchema);
export default Customer;
