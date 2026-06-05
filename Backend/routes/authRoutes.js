import express from "express";
import passport from "passport";
import User from "../models/user.js";
import jwt from "jsonwebtoken";
const router = express.Router();
//const JWT_SECRET = "e67d565d9f409d4669b09c2c336d5d9593020d0cf35ac065b959a589311f9b83";
import dotenv from 'dotenv';
dotenv.config();
const JWT_SECRET = process.env.JWT_SECRET;
// Signup route
router.post("/signup", async (req, res) => {
  const { username, email, password } = req.body;
  try {
    const newUser = new User({
      username,
      email,
    });
    const registeredUser = await User.register(newUser, password);
    console.log(registeredUser);
    res.status(201).json({ success: true, message: "User registered successfully" });
  } catch (err) {
    res.status(500).send(err.message);
  }
});

// Login route
router.post("/login", passport.authenticate("local"), (req, res) => {
  
  if (!req.user) {
  console.error("No user found on req.user after authentication!");
}
// console.log("user data",req.user)
  if (req.isAuthenticated()) {
    console.log("user data",req.user)
    const token = jwt.sign({ username: req.user.username }, JWT_SECRET, { expiresIn: "14d" });
    console.log(token);
    res.status(200).json({ success: true, message: "Login successful",token });
  } else {
    res.status(401).json({ success: false, message: "Invalid credentials" });
  }
});

export default router;
