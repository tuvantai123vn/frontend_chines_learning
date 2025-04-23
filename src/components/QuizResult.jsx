import { useLocation } from "react-router-dom";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable"; // Đảm bảo import autoTable đúng cách
import "../pages/custom-font"; 

const QuizResult = () => {
  const location = useLocation();
  const { quizData, answers, score } = location.state;

  const generatePDF = () => {
    const doc = new jsPDF();

    doc.setFont("helvetica", "normal");

    // Thêm tiêu đề
    doc.setFontSize(18);
    doc.text("Kết quả Quiz", 105, 20, { align: "center" });

    // Thêm điểm
    doc.setFontSize(14);
    doc.text(`Điểm của bạn: ${score}`, 20, 40);

    // Thêm bảng câu hỏi và câu trả lời
    const tableData = quizData.map((vocab, index) => [
      vocab.meaning,
      answers[index] || "Chưa trả lời",
      vocab.hanzi
    ]);

    // Sử dụng autoTable để tạo bảng
    autoTable(doc, {
      head: [["Câu hỏi", "Câu trả lời của bạn", "Đáp án đúng"]],
      body: tableData,
      startY: 50,
      theme: "striped",
      headStyles: { fillColor: [22, 160, 133] },
      columnStyles: {
        0: { cellWidth: 60 },
        1: { cellWidth: 60 },
        2: { cellWidth: 60 },
      },
    });

    // Tải file PDF
    doc.save("Quiz-Result.pdf");
  };

  return (
    <div className="container mx-auto p-6">
      <h2 className="text-3xl font-bold mb-6">Kết quả Quiz</h2>

      <div className="mb-6">
        <p className="text-lg">Điểm của bạn: {score}</p>
      </div>

      <div className="mb-6">
        <h3 className="text-xl font-semibold">Danh sách câu hỏi và câu trả lời</h3>
        {quizData.map((vocab, index) => (
          <div key={vocab._id} className="mb-4 p-4 border rounded shadow-md">
            <p><strong>Câu hỏi:</strong> {vocab.meaning}</p>
            <p><strong>Câu trả lời của bạn:</strong> {answers[index] || 'Chưa trả lời'}</p>
            <p><strong>Đáp án đúng:</strong> {vocab.hanzi}</p>
            <hr />
          </div>
        ))}
      </div>

      <button
        onClick={generatePDF}
        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
      >
        Xuất PDF
      </button>
    </div>
  );
};

export default QuizResult;
