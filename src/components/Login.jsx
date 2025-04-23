import React, { useState } from "react";

export default function Example() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  // Hàm xử lý đăng nhập
  const handleLogin = async (e) => {
    const token = localStorage.getItem("token");
    if (token) return <Navigate to="/dashboard" replace />;
    e.preventDefault();

    if (!email || !password) {
      setErrorMessage("Vui lòng nhập email và mật khẩu!");
      return;
    }

    try {
      const response = await fetch("http://localhost:5001/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (data.token) {
        localStorage.setItem("token", data.token); // Lưu token vào localStorage
        window.location.href = "/dashboard"; // Chuyển hướng sau khi đăng nhập thành công
      } else {
        setErrorMessage(data.msg || "Đăng nhập thất bại");
      }
    } catch (error) {
      setErrorMessage("Đã có lỗi xảy ra. Vui lòng thử lại sau!");
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
            Đăng nhập vào tài khoản của bạn
          </h2>
        </div>

        {errorMessage && (
          <div className="text-center text-red-500 mb-4">{errorMessage}</div>
        )}

        <form onSubmit={handleLogin}>
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
            Đăng nhập
          </button>
        </form>

        <p className="mt-4 text-center text-sm text-gray-500">
          Bạn chưa có tài khoản?{" "}
          <a
            href="#"
            className="text-indigo-600 hover:text-indigo-700 font-semibold"
          >
            Đăng ký ngay
          </a>
        </p>
      </div>
    </div>
  );
}
