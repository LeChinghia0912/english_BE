const jwt = require("jsonwebtoken");

function authenticateToken(req, res, next) {
  const token = req.header("Authorization")?.replace("Bearer ", "");
  if (!token) {
    return res
      .status(401)
      .json({ message: "Không có token, yêu cầu xác thực" });
  }

  // Kiểm tra tính hợp lệ của token
  jwt.verify(token, "your_jwt_secret", (err, decoded) => {
    if (err) {
      return res.status(403).json({ message: "Token không hợp lệ" });
    }

    req.user = decoded; // Lưu thông tin người dùng vào request
    next();
  });
}

module.exports = authenticateToken;
