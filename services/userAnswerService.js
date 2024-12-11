const { userLessonResult } = require("../models/lessonModel");

async function saveUserAnswers(user_id, results, lesson_id) {
  // Kiểm tra nếu results là một mảng hợp lệ với mỗi phần tử là đối tượng có cấu trúc { question_id, results }
  if (!Array.isArray(results) || results.some(item => !item.question_id || !Array.isArray(item.results) || item.results.some(result => typeof result !== "string"))) {
    throw new Error("Invalid results format. Each item must have 'question_id' and an array of strings as 'results'.");
  }

  const savedResults = []; // Mảng để lưu kết quả đã lưu hoặc cập nhật

  // Lặp qua tất cả các kết quả của người dùng
  for (const userAnswer of results) {
    const { question_id, results: answerResults } = userAnswer;

    // Kiểm tra nếu người dùng đã trả lời câu hỏi này chưa
    let existingAnswer = await userLessonResult.findOne({ user_id, question_id });

    if (existingAnswer) {
      // Nếu câu trả lời đã tồn tại, cập nhật câu trả lời
      existingAnswer.results = answerResults;
      await existingAnswer.save(); // Lưu kết quả đã cập nhật

      savedResults.push(existingAnswer);
    } else {
      // Nếu chưa có kết quả, tạo mới và lưu vào DB
      const newUserLessonResult = new userLessonResult({
        user_id,
        question_id,
        lesson_id,
        results: answerResults,
      });

      await newUserLessonResult.save(); // Lưu mới vào DB
      savedResults.push(newUserLessonResult);
    }
  }

  return savedResults;
}

module.exports = { saveUserAnswers };
