// models/Item.js
const mongoose = require("mongoose");

const chapterSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    title: { type: String, required: true },
    poster: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    isUnlocked: { type: Boolean, required: true, default: false },
  },
  { timestamps: true }
);

const Chapters = mongoose.model("chapters", chapterSchema);

module.exports = Chapters;
