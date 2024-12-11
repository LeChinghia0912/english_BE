const Statistic = require("../models/statisticModel");

const getRank = async (req, res) => {
  const { limit = 10 } = req.query; // Lấy limit từ query, mặc định là 10

  try {
    // Lấy danh sách người dùng theo điểm số giảm dần
    const leaderboard = await Statistic.find()
      .sort({ score: -1 })
      .limit(parseInt(limit, 10))
      .populate("user_id", "fullname email"); // Lấy thông tin người dùng (tên, email)

    res.status(200).json({
      message: "Lấy bảng xếp hạng thành công",
      data: leaderboard,
    });
  } catch (error) {
    res.status(500).json({
      message: "Có lỗi xảy ra",
      error: error.message,
    });
  }
};

module.exports = { getRank };
