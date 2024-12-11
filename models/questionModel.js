const mongoose = require("mongoose");

// Main Question Schema
const questionSchema = new mongoose.Schema(
  {
    label: { type: String, required: true }, // Câu hỏi
    mutiSelect: { type: Boolean, required: true }, // Có chọn nhiều không
    layer: { type: Number, required: true }, // Layer
    results: [{ type: String, required: true }], // Kết quả đúng
    child: [
      {
        result: { type: String, required: true }, // Kết quả
        poster: { type: String, required: true }, // Poster
      },
    ], // Các lựa chọn cho câu hỏi
    lesson_id: { type: mongoose.Schema.Types.ObjectId, ref: "Lesson" },
  },
  { timestamps: true }
);

const Question = mongoose.model("questions", questionSchema);

module.exports = Question;
