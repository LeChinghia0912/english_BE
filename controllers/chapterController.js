const Chapters = require("../models/chapterModel");
const { paginateItems } = require("../utils/pagination");
const { Lessons, userLessonResult } = require("../models/lessonModel");
const Question = require("../models/questionModel");
// const cloudinary = require("cloudinary").v2;

// cloudinary.config({
//   cloud_name: process.env.CLOUD_NAME,
//   api_key: process.env.CLOUD_API_KEY,
//   api_secret: process.env.CLOUD_API_SECRET,
// });

// Lấy tất cả các chương học theo Course ID
const getChaptersByCategorySlug = async (req, res) => {
  try {
    // Lấy trang và limit từ query string
    const { page, limit, search, type } = req.query;

    // Khởi tạo bộ lọc cơ bản
    let filter = {};

    // Thêm điều kiện lọc dựa trên type
    if (type === "phien-am") {
      filter.slug = "chuong-999"; // Chỉ lấy slug: chuong-999
    } else if (type === "hoc") {
      filter.slug = { $ne: "chuong-999" }; // Lấy tất cả trừ slug: chuong-999
    }

    const result = await paginateItems(filter, page, limit, Chapters, search);

    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ error: "Có lỗi xẩy ra" });
  }
};

const getChapterById = async (req, res) => {
  const { id } = req.params;

  try {
    if (!id) return res.status(400).json({ message: "Thiếu chapter id" });

    const result = await Chapters.findById(id);

    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const createChapter = async (req, res) => {
  const { name, title, poster } = req.body;

  try {
    if (!name || !title || !poster)
      throw new Error(
        "Dữ liệu không hợp lệ, cần phải có 2 trường name và title"
      );

    const slug = name
      .replaceAll(" ", "-")
      .toLowerCase()
      .replace(/chương/g, "chuong");

    const checkChapter = await Chapters.findOne({ slug });

    if (checkChapter)
      return res.status(400).json({ message: "Chương đã tồn tại" });

    const newChapters = new Chapters({ name, title, slug, poster });

    await newChapters.save();

    res.status(200).json({ message: "Tạo chapter thành công" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// const uploadFile = async (req, res) => {
//   const { file } = req.body;
//   try {
//     const res = await cloudinary.uploader.upload("https://www.vietnamworks.com/hrinsider/wp-content/uploads/2023/12/hinh-thien-nhien-3d-002.jpg", {width: 100, height: 150, crop: "fill", fetch_format: "auto"})
//     console.log(res)

//     // Thông tin file được upload

//     res.status(200).json({
//       message: "thành công"
//     });
//   } catch (error) {
//     res.status(500).json({
//       message: "Lỗi upload file",
//       error: error.message,
//     });
//   }
// };

const updateChapter = async (req, res) => {
  const updatedData = req.body;
  const { chapter_id } = req.params;

  try {
    if (!chapter_id)
      return res.status(400).json({ message: "Thiếu chapter_id" });

    const checkChapter = await Chapters.findOne({ slug: updatedData.slug });

    if (checkChapter)
      return res.status(400).json({ message: "Chương đã tồn tại" });

    const result = await Chapters.findByIdAndUpdate(
      { _id: chapter_id },
      updatedData,
      { new: true }
    );

    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const deleteChapter = async (req, res) => {
  const { id: chapterId } = req.body;

  try {
    if (!chapterId)
      return res.status(400).json({ error: "id không được để trống" });

    const lessons = await Lessons.find({ chapter_id: chapterId });
    const lessonIds = lessons.map((lesson) => lesson._id);

    // Xóa kết quả bài học của người dùng liên quan đến các bài học
    await Question.deleteMany({ lesson_id: { $in: lessonIds } });

    await userLessonResult.deleteMany({ lesson_id: { $in: lessonIds } });

    await Lessons.deleteMany({ chapter_id: chapterId });

    await Chapters.findByIdAndDelete(chapterId);

    res.status(200).json({ message: "Chapter đã được xóa thành công" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const countChapter = async (req, res) => {
  try {
    const chapterCount = await Chapters.countDocuments();
    res.json({ count: chapterCount });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Error counting chapters" });
  }
};

module.exports = {
  getChaptersByCategorySlug,
  createChapter,
  deleteChapter,
  updateChapter,
  getChapterById,
  // uploadFile,
  countChapter
};
