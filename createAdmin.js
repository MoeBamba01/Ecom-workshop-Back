require("dotenv").config();
const mongoose = require("mongoose");
const connectDB = require("./config/db.js");
const User = require("./models/User.js");

async function createAdmin() {
  await connectDB();

  const exists = await User.findOne({ email: "admin@shop.com" });
  if (exists) {
    console.log("Admin existe déjà");
  } else {
    // create() déclenche le pre("save") → le mot de passe est hashé
    await User.create({
      name: "Admin",
      email: "admin@shop.com",
      password: "admin123",
      isAdmin: true,
    });
    console.log("Admin créé : admin@shop.com / admin123");
  }

  await mongoose.disconnect();
}

createAdmin();
