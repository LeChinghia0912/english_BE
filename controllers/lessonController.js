const { isArray } = require("lodash");

const Chapters = require("../models/chapterModel");
const Question = require("../models/questionModel");
const { paginateItems } = require("../utils/pagination");
const { checkAndUpdateScore } = require("../services/scoreService");
const { saveUserAnswers } = require("../services/userAnswerService");
const { Lessons, LessonStatus, userLessonResult } = require("../models/lessonModel");

const getLessonsByChapterId = async (req, res) => {
  try {
    const user = req.user;
    const { page, limit } = req.query;
    const { chapterSlug } = req.params;

    const chapter = await Chapters.findOne({ slug: chapterSlug });

    if (!chapter) return res.status(404).json({ message: "Chapter không tồn tại" });

    // Lấy trạng thái hoàn thành và mở khóa của các bài học
    const lessons = await Lessons.find({ chapter_id: chapter._id }).lean();
    const lessonStatus = await LessonStatus.find({ user_id: user.id }).lean();

    // Map trạng thái vào danh sách bài học
    const lessonsWithStatus = lessons.map((lesson, index) => {
      const userLesson = lessonStatus.find((ul) => ul.lesson_id.equals(lesson._id));

      // Mở khóa bài học đầu tiên của chapter
      const isUnlocked = index === 0 ? true : userLesson?.isUnlocked || false;

      return {
        ...lesson,
        isUnlocked
      };
    });

    const result = await paginateItems({}, page, limit, lessonsWithStatus);

    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ error: "Lỗi khi lấy danh sách bài học" });
  }
};

const handleSubmitLesson = async (req, res) => {
  const results = req.body;
  const { id } = req.user;
  const { chapter_id, lesson_id } = req.query;

  let nextLesson = "";

  try {
    const lessonByChapterId = await Lessons.find({chapter_id});

    const lessons = lessonByChapterId.sort((a, b) => {
      const getNumber = (slug) => parseInt(slug.match(/\d+$/)?.[0] || "0", 10);
    
      const numA = getNumber(a.slug);
      const numB = getNumber(b.slug);
    
      return numA - numB;
    });

    lessons.forEach((lesson, idx) => {
      if(lesson._id == lesson_id) {
        if(lessons[idx+1]) {
          nextLesson = lessons[idx + 1];
        }
      }
    });

    if(nextLesson) {
      const newLessonStatus = new LessonStatus({
        user_id: id,
        isUnlocked: true,
        lesson_id: nextLesson._id,
      });
      
      await newLessonStatus.save();
    }

    await saveUserAnswers(id, results, lesson_id);
    await checkAndUpdateScore(id, results, lesson_id);

    // Trả về kết quả cho client
    res.status(201).json({ message: "Gửi câu hỏi thành công" });
  } catch (error) {
    res.status(500).json({ message: error.message || "Error saving user answers", error });
  }
};

const createLesson = async (req, res) => {
  const { name, title, chapter_id, poster } = req.body;
  const user = req.user;

  try {
    const getChapter = await Chapters.findOne({ _id: chapter_id });

    if(!getChapter) return res.status(404).json({ message: "Chương học không tồn tại" });

    const slug = name.replaceAll(" ", "-").toLowerCase().replace(/bài/g, "bai");

    const lessons = await Lessons.find({ chapter_id });
    const match = getChapter.slug.match(/-(\d+)/); // Tìm số sau dấu '-'

    if (match) {
      const newLesson = new Lessons({ name, title, slug: `${slug}-${match[1]}`, chapter_id, poster });

      if(isArray(lessons) && lessons.length <= 0) {
        const newLessonStatus = new LessonStatus({user_id: user.id, lesson_id:newLesson._id, isUnlocked: true });
        await newLessonStatus.save();
      }else {
        const newLessonStatus = new LessonStatus({user_id: user.id, lesson_id:newLesson._id, isUnlocked: false });
        await newLessonStatus.save();
      }

      await newLesson.save();
    }

    res.status(200).json({ message: "Tạo bài học thành công" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const updateLesson = async (req, res) => {
  const updatedData = req.body;
  const { lesson_id } = req.params;

  try {
    if(!lesson_id) return res.status(400).json({ message: "Thiếu lesson_id" });

    const result = await Lessons.findByIdAndUpdate({_id: lesson_id}, updatedData, { new: true });

    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

const deleteLesson = async (req, res) => {
  const { id: lessonId } = req.body;

  try {
    if(!lessonId) return res.status(400).json({ error: "Id không được để trống" });

    await Lessons.findByIdAndDelete(lessonId);
    await LessonStatus.deleteOne({lesson_id: {$in: lessonId}});
    await Question.deleteMany({ lesson_id: { $in: lessonId } });
    await userLessonResult.deleteMany({ lesson_id: { $in: lessonId } });

    res.status(200).json({ message: "Bài học đã được xóa thành công" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getLessonsByChapterId, handleSubmitLesson, createLesson, deleteLesson, updateLesson };