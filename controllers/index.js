const { getChaptersByCategorySlug  } = require("./chapterController");
const { getLessonsByChapterId } = require("./lessonController");
const { getQuestionsByChapterAndLesson } = require("./questionController");

module.exports = { getChaptersByCategorySlug , getLessonsByChapterId, getQuestionsByChapterAndLesson };
