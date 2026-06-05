// models/Transaction.js
import { Schema } from "mongoose";
import mongoose from "mongoose";
const transactionSchema = new mongoose.Schema({
  TransactionID: {
    type: Number,
    required: true,
    unique: true
  },
  Items: {
    type: String,
    required: true
  },
  TotalCost: {
    type: Number,
    required:true
  },
  UserID: {
    type:Number,
    required:true
  },
});
const Transaction= mongoose.model("transactions",transactionSchema);
export default Transaction;
