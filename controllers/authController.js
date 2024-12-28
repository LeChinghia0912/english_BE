const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const User = require("../models/user");
const { paginateItems } = require("../utils/pagination");

// Đăng ký
exports.register = async (req, res) => {
  const { email, password, fullname, age, level, phone } = req.body;

  // Kiểm tra xem email đã tồn tại chưa
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    return res.status(400).json({ message: "Email đã tồn tại" });
  }

  // Mã hóa mật khẩu trước khi lưu vào DB
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  // Tạo người dùng mới
  const newUser = new User({
    email,
    password: hashedPassword,
    fullname,
    age,
    level,
    phone,
  });

  // Lưu người dùng vào cơ sở dữ liệu
  try {
    await newUser.save();
    res.status(201).json({ message: "Đăng ký thành công!" });
  } catch (err) {
    res.status(500).json({ message: err });
  }
};

// Đăng nhập
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Kiểm tra dữ liệu
    if (!email || !password) {
      return res.status(400).json({ message: "Email và Password là bắt buộc" });
    }

    // Tìm người dùng theo email
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: "Email không tồn tại" });

    // Kiểm tra mật khẩu
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch)
      return res.status(400).json({ message: "Mật khẩu không chính xác" });

    // Tạo access_token (thời gian sống 1 giờ)
    const access_token = jwt.sign(
      { id: user._id },
      "your_jwt_secret",
      { expiresIn: "9h" } // Access token hết hạn sau 1 giờ
    );

    // Tạo refresh_token (thời gian sống 7 ngày)
    const refresh_token = jwt.sign(
      { id: user._id },
      "your_refresh_token_secret",
      { expiresIn: "1d" } // Refresh token hết hạn sau 7 ngày
    );

    res.status(200).json({
      message: "Đăng nhập thành công",
      tokens: {
        access_token,
        refresh_token,
      },
      user: {
        id: user._id,
        fullname: user.fullname,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    console.error("Lỗi khi đăng nhập:", error);
    res.status(500).json({ message: "Lỗi máy chủ", error });
  }
};

// Refresh Token
exports.refreshToken = async (req, res) => {
  const { refresh_token } = req.body;

  if (!refresh_token) {
    return res.status(400).json({ message: "Không có refresh token" });
  }

  try {
    // Kiểm tra tính hợp lệ của refresh token
    jwt.verify(
      refresh_token,
      "your_refresh_token_secret",
      async (err, decoded) => {
        if (err) {
          return res
            .status(403)
            .json({ message: "Refresh token không hợp lệ" });
        }

        // Tìm user từ refresh token
        const user = await User.findById(decoded.id);
        if (!user) {
          return res.status(403).json({ message: "User không tồn tại" });
        }

        // Tạo lại access token mới
        const new_access_token = jwt.sign(
          { id: user._id },
          "your_jwt_secret",
          { expiresIn: "1h" } // Access token hết hạn sau 1 giờ
        );

        res.status(200).json({
          message: "Cấp lại access token thành công",
          tokens: {
            access_token: new_access_token,
          },
        });
      }
    );
  } catch (error) {
    console.error("Lỗi khi refresh token:", error);
    res.status(500).json({ message: "Lỗi máy chủ", error });
  }
};

// change password

exports.changePassword = async (req, res) => {
  const { currentPassword, newPassword, confirmPassword } = req.body;
  const { id } = req.user;

  // Kiểm tra đầu vào
  if (!currentPassword || !newPassword || !confirmPassword) {
    return res
      .status(400)
      .json({ message: "Please provide both current password, new password, and confirm password." });
  }

  if (newPassword !== confirmPassword) {
    return res.status(400).json({ message: "New password and confirm password do not match." });
  }

  // Kiểm tra độ dài mật khẩu mới (Ví dụ: ít nhất 8 ký tự)
  if (newPassword.length < 8) {
    return res
      .status(400)
      .json({ message: "New password must be at least 8 characters long." });
  }

  try {
    // Lấy thông tin người dùng từ JWT
    const user = await User.findById(id);

    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    // Kiểm tra mật khẩu hiện tại
    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) {
      return res
        .status(401)
        .json({ message: "Current password is incorrect." });
    }

    // Hash mật khẩu mới
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);

    // Cập nhật mật khẩu mới vào cơ sở dữ liệu
    const result = await User.findByIdAndUpdate(
      { _id: id },
      { password: hashedPassword },
      { new: true }
    );

    res.status(200).json({ message: "Password changed successfully." });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "An error occurred while changing the password.", error: error.message });
  }
};

exports.changeInfo = async (req, res) => {
  const updatedData = req.body;
  const { id } = req.user;

  try {
    const checkUserId = await User.findById(id);

    if(!checkUserId) return res.status(401).json("User không tồn tại");

    const result = await User.findByIdAndUpdate({_id: id}, updatedData, { new: true });

    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ message: "Có lỗi xảy ra", error: error.message });
  }
};

exports.getAllUser = async (req, res) => {
  const { page, limit } = req.query;

  try {
    const result = await paginateItems({}, page, limit, User);

    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ message: "Có lỗi xảy ra", error: error.message });
  }
};

exports.getUserById = async (req, res) => {
  const { id } = req.params;

  try {
    if (!id) return res.status(400).json({ message: "Thiếu user id" });

    const result = await User.findById(id);

    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
