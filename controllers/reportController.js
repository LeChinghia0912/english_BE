const Report = require("../models/reportModel");
const { paginateItems } = require("../utils/pagination");

const getReport = async (req, res) => {
  try {
    const { page, limit } = req.query;

    const result = await paginateItems({}, page, limit, Report);

    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ message: "Có lỗi xảy ra", error: error.message });
  }
};

const createReport = async (req, res) => {
  try {
    const user = req.user;
    const { question_id, content } = req.body;

    if (!question_id || !content || !user) {
      return res.status(400).json({ message: "Thiếu một số trường dữ liệu" });
    }

    const report = new Report({ question_id, content, user_id: user.id });
    await report.save();

    res.status(200).json({ message: "Report thành công" });
  } catch (error) {
    res.status(500).json({ message: "Có lỗi xảy ra", error: error.message });
  }
};

const deleteReport = async (req, res) => {
  try {
    const { id } = req.body;

    if (!id) return res.status(400).json({ message: "Thiếu ID" });

    const reportExists = await Report.findById(id);

    if (!reportExists) return res.status(404).json({ message: "ID không tồn tại" });

    await Report.findByIdAndDelete(id);

    res.status(200).json({ message: "Xóa report thành công" });
  } catch (error) {
    res.status(500).json({ message: "Có lỗi xảy ra", error: error.message });
  }
};

module.exports = { getReport, createReport, deleteReport };
