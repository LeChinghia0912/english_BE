const mongoose = require("mongoose");

const feedbackSchema = new mongoose.Schema(
  {
    user_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "users",
      required: true,
    },
    fullname: { type: String, required: true },
    content: { type: String, required: true },
    number_star: { type: String, required: true },
  },
  { timestamps: true }
);

const Feedback = mongoose.model("feedbacks", feedbackSchema);

module.exports = Feedback;
