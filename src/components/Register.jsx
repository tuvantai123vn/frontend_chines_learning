import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { registerUser } from "../api"; // Import hàm đăng ký từ api.js

const Register = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false); // Thêm biến loading
  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true); // Đánh dấu quá trình đăng ký bắt đầu
    console.log(username, email, password)
    try {
      // Gọi API để đăng ký
      await registerUser(username, email, password);
      navigate("/login"); // Chuyển hướng sang trang đăng nhập sau khi đăng ký thành công
    } catch (err) {
      setError("Lỗi khi đăng ký người dùng: " + err.message); // Hiển thị thông báo lỗi từ backend
    } finally {
      setLoading(false); // Đánh dấu quá trình kết thúc
    }
  };
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-600">
      <div className="bg-white w-full sm:max-w-md px-6 py-8 rounded-lg shadow-lg">
        <div className="text-center mb-6">
          <img
            alt="Your Company"
            src="https://tailwindcss.com/plus-assets/img/logos/mark.svg?color=indigo&shade=600"
            className="mx-auto h-10 w-auto"
          />
          <h2 className="mt-4 text-2xl font-bold text-gray-800">
            Đăng kí tài khoản của bạn
          </h2>
        </div>

        {error && (
          <div className="text-center text-red-500 mb-4">{error}</div>
        )}

        <form onSubmit={handleRegister}>
          <div className="mb-6">
            <label
              htmlFor="username"
              className="block text-sm font-medium text-gray-700"
            >
              Tên người dùng
            </label>
            <input
              type="text"
              placeholder="Username"
              required
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="mt-2 w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div className="mb-4">
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700"
            >
              Email
            </label>
            <input
              type="email"
              id="email"
              name="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-2 w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="Nhập email"
            />
          </div>

          <div className="mb-6">
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700"
            >
              Mật khẩu
            </label>
            <input
              type="password"
              id="password"
              name="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-2 w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="Nhập mật khẩu"
            />
          </div>

          <button
            type="submit"
            className="w-full py-2 px-4 bg-indigo-600 text-white font-semibold rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            {loading ? (
              <span className="animate-spin">Đang đăng ký...</span>
            ) : (
              "Đăng ký"
            )}
          </button>
        </form>

        <p className="mt-4 text-center text-sm text-gray-500">
          Bạn đã có tài khoản?{" "}
          <a
            href="/login"
            className="text-indigo-600 hover:text-indigo-700 font-semibold"
          >
            Đăng nhập ngay
          </a>
        </p>
      </div>
    </div>
  );
};

export default Register;
