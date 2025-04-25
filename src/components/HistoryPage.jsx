import React, { useState, useEffect } from "react";
import { getHistory } from "../api"; // Đảm bảo đã import hàm getHistory từ api.js

const HistoryPage = () => {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  // Lấy dữ liệu lịch sử từ API
  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          console.error("No token found");
          setLoading(false);
          return;
        }

        const response = await getHistory(token); // Gọi API từ api.js
        setHistory(response.data); // Lưu kết quả vào state
        setLoading(false);
      } catch (error) {
        console.error("❌ Lỗi khi lấy lịch sử bài kiểm tra:", error);
        setLoading(false);
      }
    };

    fetchHistory();
  }, []);

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-semibold text-center text-gray-800 mb-6">Lịch sử kiểm tra</h1>
      
      {loading ? (
        <div className="flex justify-center items-center">
          <div className="spinner-border animate-spin inline-block w-8 h-8 border-4 rounded-full border-t-transparent border-blue-600" role="status"></div>
        </div>
      ) : (
        <div className="overflow-x-auto bg-white shadow rounded-lg">
          <table className="min-w-full table-auto">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-4 py-2 text-left text-gray-600">STT</th>
                <th className="px-4 py-2 text-left text-gray-600">Từ vựng</th>
                <th className="px-4 py-2 text-left text-gray-600">Câu trả lời</th>
                <th className="px-4 py-2 text-left text-gray-600">Đúng/Sai</th>
                <th className="px-4 py-2 text-left text-gray-600">Thời gian làm</th>
              </tr>
            </thead>
            <tbody>
              {history.length > 0 ? (
                history.map((item, index) => (
                  <tr key={item._id} className="border-b hover:bg-gray-50">
                    <td className="px-4 py-2 text-gray-700">{index + 1}</td>
                    <td className="px-4 py-2 text-gray-700">
                      <p className="font-semibold">{item.questionId.hanTu}</p>
                      <p className="text-sm text-gray-500">{item.questionId.pinyin}</p>
                    </td>
                    <td className="px-4 py-2 text-gray-700">{item.userAnswer}</td>
                    <td className="px-4 py-2">
                      <span
                        className={`px-2 py-1 rounded-full text-sm ${
                          item.isCorrect ? "bg-green-500 text-white" : "bg-red-500 text-white"
                        }`}
                      >
                        {item.isCorrect ? "Đúng" : "Sai"}
                      </span>
                    </td>
                    <td className="px-4 py-2 text-gray-500">{new Date(item.updatedAt).toLocaleString()}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="text-center text-gray-500 py-4">Không có dữ liệu lịch sử</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default HistoryPage;
