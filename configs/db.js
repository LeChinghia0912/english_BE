// config/db.js
const mongoose = require("mongoose");
require("dotenv").config();  // Thêm dòng này để tải file .env

async function connect() {
  try {
    // Thay đổi URL để kết nối với MongoDB Atlas
    const dbUri = process.env.MONGO_URI;
        await mongoose.connect(dbUri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      serverSelectionTimeoutMS: 5000, // Thời gian chờ tối đa khi kết nối
    });

    console.log("Kết nối DB thành công");
  } catch (error) {
    console.log("🚀 ~ connect ~ error:", error);
    console.log("Kết nối thất bại");
    process.exit(1);
  }
}

module.exports = { connect };
