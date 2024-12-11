// config/db.js
const mongoose = require("mongoose");

async function connect() {
  try {
    // Thay đổi URL để kết nối với MongoDB Atlas
    const dbUri = "mongodb+srv://nghia3009:nghia3009@cluster0.1cshm.mongodb.net/";
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
