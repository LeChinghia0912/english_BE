const { get } = require("lodash");
const Chapters = require("../models/chapterModel");
const Lesson = require("../models/lessonModel");
const Question = require("../models/questionModel");
const User = require("../models/user");

// Lấy danh sách câu hỏi theo chapter và lesson
const getQuestionsByChapterAndLesson = async (req, res) => {
  try {
    const {id} = req.user;
    const { lesson_id } = req.query;
    const { chapterSlug, lessonSlug } = req.params;

    const user = await User.findById(id);

    const roles = get(user, ["role"]);

    const lessonStatus = await Lesson.LessonStatus.findOne({lesson_id});

    if(!lessonStatus && roles !== "admin") return res.status(401).json({ message: "Bài học chưa được mở" });

    // Tìm chapter theo slug
    const chapter = await Chapters.findOne({ slug: chapterSlug });
    if (!chapter) return res.status(404).json({ message: "Chapter không tồn tại" });

    // Tìm lesson theo slug và chapter_id
    const lesson = await Lesson.Lessons.findOne({
      slug: lessonSlug,
      chapter_id: chapter._id,
    });

    if (!lesson) return res.status(404).json({ message: "Lesson không tồn tại" });

    // Lấy danh sách câu hỏi thuộc lesson
    const questions = await Question.find({ lesson_id: lesson._id });

    // Kiểm tra nếu không có câu hỏi
    if (!questions || questions.length === 0) return res.status(404).json({ message: "Không có câu hỏi cho bài học này" });

    // Trả về danh sách câu hỏi
    res.status(200).json({ items: questions });
  } catch (error) {
    res.status(500).json({ message: error.message, error });
  }
};

const createQuestion = async (req, res) => {
  const { label, mutiSelect, layer, results, options, lesson_id, poster } = req.body;

  try {
    const existLessonId = await Lesson.Lessons.exists({_id: lesson_id})

    if(!existLessonId) return res.status(404).json({ message: "Bài học không tồn tại" });

    const newQuestion = new Question({ label, mutiSelect, layer, results, options, lesson_id, poster });

    await newQuestion.save();

    res.status(200).json({ message: "Tạo câu hỏi thành công" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateQuestion = async (req, res) => {
  const updatedData = req.body;
  const { question_id } = req.params;

  try {
    if(!question_id) return res.status(400).json({ message: "Thiếu question_id" }); 

    Question.findByIdAndUpdate({_id: question_id}, updatedData, { new: true });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

const deleteQuestion = async (req, res) => {
  const { id } = req.body;

  try {
    await Question.findByIdAndDelete(id);
    await Lesson.userLessonResult.deleteMany({ question_id: { $in: id } });

    res.status(200).json({ message: "Câu hỏi đã được xóa thành công" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getQuestionsByChapterAndLesson, createQuestion, deleteQuestion, updateQuestion };
