const mongoose = require("mongoose");

// Main Question Schema
const questionSchema = new mongoose.Schema(
  {
    label: { type: String, required: true }, // Câu hỏi
    poster: { type: String, required: true }, // Câu hỏi
    mutiSelect: { type: Boolean, required: true }, // Có chọn nhiều không
    layer: { type: Number, required: true }, // Layer
    results: [{ type: String, required: true }], // Kết quả đúng
    options: [{ type: String, required: true }], // Các lựa chọn cho câu hỏi
    lesson_id: { type: mongoose.Schema.Types.ObjectId, ref: "Lesson" },
  },
  { timestamps: true }
);

const Question = mongoose.model("questions", questionSchema);

module.exports = Question;
