// models/Item.js
const mongoose = require("mongoose");

const statisticSchema = new mongoose.Schema(
  {
    user_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "users",
      required: true,
    },
    lesson_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "questions",
      required: true,
    },
    score: { type: Number, required: true },
  },
  { timestamps: true }
);

const Statistic = mongoose.model("statistics", statisticSchema);

module.exports = Statistic;
