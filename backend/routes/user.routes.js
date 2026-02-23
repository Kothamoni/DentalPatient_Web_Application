const express = require("express");
const bcrypt = require("bcryptjs");
const User = require("../models/user.model"); // no .js needed for CommonJS

const router = express.Router();

// Generate unique userId
function generateUserId() {
  return "DENTAL-" + Math.floor(Math.random() * 1000000);
}
//signup

router.post('/signup', async (req, res) => {
  try {
    const { name, phone, email, address, password } = req.body;

    if (!name || !phone || !email || !address || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "Email already registered" });
    }

    const newUser = new User({
      name,
      phone,
      email,
      address,
      password
    });

    await newUser.save();

    res.status(201).json({ message: "Signup successful" });

  } catch (error) {
    console.error("Signup Error:", error);
    res.status(500).json({ message: "Server error during signup" });
  }
});
// Login
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: "User not found" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: "Invalid password" });

    res.json({ message: `Login successful! Welcome, ${user.name}` });
  } catch (err) {
    res.status(500).json({ message: "Error logging in", error: err.message });
  }
});

module.exports = router;
