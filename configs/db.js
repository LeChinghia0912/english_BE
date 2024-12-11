// config/db.js
const mongoose = require("mongoose");

async function connect() {
  try {
    // await mongoose.connect("mongodb://localhost/english", {
    //   useNewUrlParser: true,
    //   useUnifiedTopology: true,
    //   serverSelectionTimeoutMS: 5000,
    // });
    await mongoose.connect("mongodb://localhost:27017/english", {});

    console.log("Kêt nối DB thành công");
  } catch (error) {
    console.log("🚀 ~ connect ~ error:", error)
    console.log("Kết nối thất bại");
    process.exit(1);
  }
}

module.exports = { connect };
