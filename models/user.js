const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      // unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    fullname: {
      type: String,
      required: true,
    },
    
    age: {
      type: Number,
      required: true,
    },

    level: {
      type: String,
      required: true,
    },

    phone: {
      type: Number,
      required: true,
    },
    role: {
      type: String,
      enum: ["user", "admin"], // Chỉ cho phép "user" hoặc "admin"
      default: "user", // Mặc định là "user"
    },
  },
  { timestamps: true }
);

const User = mongoose.model("users", userSchema);

module.exports = User;
