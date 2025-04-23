import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Quiz = () => {
  const [quizData, setQuizData] = useState([]);
  const [answers, setAnswers] = useState([]);
  const [score, setScore] = useState(null);
  const [showToast, setShowToast] = useState(false);
  const [isSubmitDisabled, setIsSubmitDisabled] = useState(true);
  const [errorMessage, setErrorMessage] = useState(""); // Thông báo lỗi nếu có
  const navigate = useNavigate();

  const fetchQuiz = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(
        `http://localhost:5001/api/quiz/random?count=20`, // Mặc định là 20 câu hỏi
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setQuizData(response.data);
      setAnswers([]);
      setScore(null);
      setIsSubmitDisabled(true);
      setErrorMessage(""); // Xóa lỗi trước đó
    } catch (err) {
      console.error("Lỗi khi lấy quiz:", err);
      setErrorMessage("Có lỗi khi tải quiz, vui lòng thử lại.");
    }
  };

  const handleAnswerChange = (e, index) => {
    const newAnswers = [...answers];
    const cleanedInput = e.target.value.replace(/[^\p{L}\p{N}\s]/gu, "");

    newAnswers[index] = cleanedInput;
    setAnswers(newAnswers);

    const allAnswered =
      newAnswers.filter((answer) => answer.trim() !== "").length ===
      quizData.length;
    setIsSubmitDisabled(!allAnswered);
  };

  const handleSubmit = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.post(
        "http://localhost:5001/api/quiz/calculate-score",
        {
          answers: quizData.map((vocab, index) => ({
            questionId: vocab._id,
            answer: answers[index] || "",
          })),
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setScore(res.data.correctAnswers);
      setShowToast(true);
      setTimeout(() => setShowToast(false), 3000);

      navigate("/quiz-result", {
        state: { quizData, answers, score: res.data.score },
      });
    } catch (err) {
      console.error("Lỗi khi nộp bài:", err);
      setErrorMessage("Có lỗi khi nộp bài, vui lòng thử lại.");
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center p-6">
      <h2 className="text-3xl font-bold text-center mb-8 text-blue-600">
        Quiz - Nhập chữ Hán
      </h2>

      <div className="mb-6">
        <button
          onClick={fetchQuiz}
          className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition"
        >
          Bắt đầu Quiz
        </button>
      </div>

      {errorMessage && (
        <div className="text-red-500 mb-4">{errorMessage}</div>
      )}

      <div className="w-full max-w-2xl space-y-4">
        {quizData.map((vocab, index) => (
          <div key={vocab._id} className="bg-white p-6 rounded-lg shadow-lg">
            <p className="text-lg font-semibold text-gray-700">
              Nghĩa: {vocab.meaning}
            </p>
            <input
              type="text"
              placeholder="Nhập chữ Hán"
              className="w-full p-3 border border-gray-300 rounded-lg mt-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={answers[index] || ""}
              onChange={(e) => handleAnswerChange(e, index)}
            />
          </div>
        ))}
      </div>

      {quizData.length > 0 && (
        <div className="mt-6">
          <button
            onClick={handleSubmit}
            disabled={isSubmitDisabled}
            className={`py-3 px-6 rounded-lg transition ${
              isSubmitDisabled
                ? "bg-gray-500"
                : "bg-green-500 hover:bg-green-600"
            } text-white`}
          >
            Nộp bài
          </button>
        </div>
      )}

      {showToast && (
        <div className="fixed bottom-5 left-1/2 transform -translate-x-1/2 bg-green-500 text-white py-3 px-6 rounded-lg shadow-lg">
          <p>Bạn đã nộp bài thành công!</p>
        </div>
      )}
    </div>
  );
};

export default Quiz;
