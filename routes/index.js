const express = require("express");
const { getRank } = require("../controllers/rankController");
const { paginationMiddleware } = require("../utils/pagination");
const checkAdminRole = require("../middlewares/checkAdminRole");
const authenticateToken = require("../middlewares/authMiddleware");
const { createFeedback, getFeedbacks } = require("../controllers/feedbackController");
const { getReport, createReport, deleteReport } = require("../controllers/reportController");
const { updateQuestion, createQuestion, deleteQuestion } = require("../controllers/questionController");
const { register, login, refreshToken, changePassword, getAllUser, changeInfo, getUserById, deleteUser } = require("../controllers/authController");
const { createChapter, deleteChapter, updateChapter, getChapterById } = require("../controllers/chapterController");
const { handleSubmitLesson, deleteLesson, createLesson, updateLesson } = require("../controllers/lessonController");
const { getChaptersByCategorySlug , getLessonsByChapterId, getQuestionsByChapterAndLesson } = require("../controllers");

const router = express.Router();

router.use(paginationMiddleware(10, 50));

// API GET:
router.get("/ranks", getRank);
router.get("/reports", getReport);
router.get("/feedbacks", getFeedbacks);
router.get("/users", authenticateToken, checkAdminRole, getAllUser);
router.get("/chapters", authenticateToken, getChaptersByCategorySlug );
router.get("/:chapterSlug", authenticateToken, getLessonsByChapterId);
router.get("/auth/users/:id", authenticateToken, checkAdminRole, getUserById);
router.get("/chapter/:id", authenticateToken, checkAdminRole, getChapterById );
router.get("/:chapterSlug/:lessonSlug", authenticateToken, getQuestionsByChapterAndLesson);

// API POST
router.post("/auth/login", login);
router.post("/auth/register", register);
router.post("/auth/refresh-token", refreshToken);

router.post("/report/created", authenticateToken, createReport);
router.post("/feedback/created", authenticateToken, createFeedback);
router.post("/lesson/submit", authenticateToken, handleSubmitLesson);
router.post("/lesson/created", authenticateToken, checkAdminRole, createLesson);
router.post("/chapters/created", authenticateToken, checkAdminRole, createChapter);
router.post("/question/created", authenticateToken, checkAdminRole, createQuestion);

// patch
router.patch("/auth/change-password", authenticateToken, changePassword);
router.patch("/auth/change-info", authenticateToken, changeInfo);

router.patch("/lesson/:lesson_id", authenticateToken, checkAdminRole, updateLesson);
router.patch("/chapter/:chapter_id", authenticateToken, checkAdminRole, updateChapter);
router.patch("/question/:question_id", authenticateToken, checkAdminRole, updateQuestion);

// API DELETE
router.delete("/report/deleted", authenticateToken, checkAdminRole, deleteReport);
router.delete("/lesson/deleted", authenticateToken, checkAdminRole, deleteLesson);
router.delete("/chapter/deleted", authenticateToken, checkAdminRole, deleteChapter);
router.delete("/question/deleted", authenticateToken, checkAdminRole, deleteQuestion);
router.delete("/auth/deleted", authenticateToken, checkAdminRole, deleteUser);

module.exports = router;
