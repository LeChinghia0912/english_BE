const mongoose = require("mongoose");

const reportSchema = new mongoose.Schema(
  {
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
    content: { type: String, required: true },
  },
  { timestamps: true }
);

const Report = mongoose.model("reports", reportSchema);

module.exports = Report;
