const Feedback = require("../models/feedbackModel");
const { paginateItems } = require("../utils/pagination");

const getFeedbacks = async (req, res) => {
  try {
    const { page, limit } = req.query;

    const result = await paginateItems({}, page, limit, Feedback);

    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ message: "Có lỗi xảy ra", error: error.message });
  }
};

const createFeedback = async (req, res) => {
  try {
    const { content, fullname, number_star } = req.body;
    const user = req.user;

    if (!content || !fullname || !user || !number_star) {
      return res.status(400).json({ message: "Thiếu một số trường dữ liệu" });
    }

    const result = new Feedback({ content, fullname, user_id: user.id, number_star });

    await result.save();
    
    res.status(200).json({ message: "Feedback thành công" });
  } catch (error) {
    res.status(500).json({ message: "Có lỗi xảy ra", error: error.message });
  }
};

module.exports = { getFeedbacks, createFeedback };
