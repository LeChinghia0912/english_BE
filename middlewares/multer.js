const { CloudinaryStorage } = require("multer-storage-cloudinary");
const multer = require("multer");
const cloudinary = require("../configs/cloudinary"); // Import file cloudinary.js

// Tạo cấu hình lưu trữ
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: "app_english", // Thư mục trên Cloudinary
    allowed_formats: ["jpg", "png", "jpeg"], // Các định dạng được phép upload
  },
});

// Khởi tạo Multer
const upload = multer({ storage });

module.exports = upload;
