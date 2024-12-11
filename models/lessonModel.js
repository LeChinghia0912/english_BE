const mongoose = require("mongoose");

const lessonSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    title: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    poster: { type: String, required: true },
    chapter_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "chapters",
      required: true,
    },
  },
  { timestamps: true }
);

const LessonStatusSchema = new mongoose.Schema({
  user_id: mongoose.Schema.Types.ObjectId, // ID của người dùng
  lesson_id: mongoose.Schema.Types.ObjectId, // ID của bài học
  isUnlocked: { type: Boolean, default: false }, // Trạng thái mở khóa
});

const UserLessonResultModel = new mongoose.Schema({
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "users",
    required: true,
  },
  
  question_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "questions",
    required: true,
  },
  
  lesson_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "lessons",
    required: true,
  },

  results: {
    type: [String], // Mảng chứa các chuỗi
    required: true,
  },
});

const Lessons = mongoose.model("lessons", lessonSchema);
const LessonStatus = mongoose.model("lessonStatus", LessonStatusSchema);
const userLessonResult = mongoose.model("userLessonResults", UserLessonResultModel);

module.exports = { Lessons, LessonStatus, userLessonResult };
