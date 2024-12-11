const Statistic = require("../models/statisticModel");
const Question = require("../models/questionModel");

const checkAndUpdateScore = async (userId, userResults) => {
  try {
    let score = 0;

    // Duyệt qua tất cả các câu trả lời từ userResults
    for (const userAnswer of userResults) {
      const { question_id, results } = userAnswer;

      // Lấy câu hỏi từ DB theo question_id
      const question = await Question.findById(question_id);

      if (question) {
        // Kiểm tra nếu câu trả lời đúng
        if (question.results.join(" ").toLocaleLowerCase() === results.join(" ").toLocaleLowerCase()) {
          score += 10; // Nếu đúng, cộng thêm 10 điểm
        }
      }
    }

    // Cập nhật hoặc tạo mới statistic cho người dùng
    await Statistic.findOneAndUpdate(
      { user_id: userId }, // Tìm kiếm theo userId
      { $inc: { score: score } }, // Cộng điểm vào score (số điểm có thể là tổng các điểm đạt được)
      {
        new: true, // Trả về tài liệu đã cập nhật
        upsert: true, // Nếu không tìm thấy người dùng, sẽ tạo bản ghi mới
      }
    );

    console.log( "Cập nhật hoặc tạo mới statistic thành công:");
  } catch (error) {
    console.error("Lỗi khi cập nhật hoặc tạo mới statistic:", error);
  }
};

module.exports = { checkAndUpdateScore };
