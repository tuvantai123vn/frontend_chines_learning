import axios from "axios";

const axiosInstance = axios.create({
    baseURL: "http://localhost:5001/api", // Đặt baseURL chung
    headers: {
      "Content-Type": "application/json",
    },
  });

// Lấy tất cả từ vựng với phân trang
export const getAllWords = (page, limit) => {
  const token = localStorage.getItem("token"); // Lấy token từ localStorage

  // Kiểm tra xem token có tồn tại hay không
  if (!token) {
    console.error("No token found!");
    return Promise.reject("No token found!");
  }

  return axiosInstance.get(`/vocab?page=${page}&limit=${limit}`, {
    headers: {
      Authorization: `Bearer ${token}`, // Thêm token vào header Authorization
    },
  });
};

// Thêm một từ vựng mới
export const addWord = (word) => {
  const token = localStorage.getItem("token");
  if (!token) {
    console.error("No token found!");
    return Promise.reject("No token found!");
  }

  return axiosInstance.post("/vocab", word, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

// Lấy từ vựng ngẫu nhiên
export const getRandomWord = () => {
  const token = localStorage.getItem("token");
  if (!token) {
    console.error("No token found!");
    return Promise.reject("No token found!");
  }

  return axiosInstance.get("/vocab/random", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

// Lấy nghĩa từ Hán tự (Dịch nghĩa)
export const fetchTranslation = async (hanziValue) => {
  try {
    const response = await axios.get(
      `https://translate.googleapis.com/translate_a/single?client=gtx&sl=zh&tl=vi&dt=t&q=${encodeURIComponent(
        hanziValue
      )}`
    );
    return response.data[0]?.map((item) => item[0]).join(" ") || "";
  } catch (error) {
    console.error("Lỗi khi dịch nghĩa:", error);
    return "";
  }
};

// Lấy Pinyin từ Hán tự
export const fetchPinyin = async (hanziValue) => {
  const token = localStorage.getItem("token");
  if (!token) {
    console.error("No token found!");
    return Promise.reject("No token found!");
  }

  try {
    const response = await axiosInstance.post(
      "/vocab/convert",
      {
        hanzi: hanziValue,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data.pinyin || "";
  } catch (error) {
    console.error("Lỗi khi lấy pinyin:", error);
    return "";
  }
};

// Lấy lịch sử bài kiểm tra
export const getHistory = (token) => {
  return axios.get("/quiz/history", {
    headers: {
      Authorization: `Bearer ${token}`, // Thêm token vào header
    },
  });
};

// Lấy quiz ngẫu nhiên
export const getRandomQuiz = (count = 20) => {
  const token = localStorage.getItem("token"); // Lấy token từ localStorage

  if (!token) {
    console.error("No token found!");
    return Promise.reject("No token found!");
  }

  return axiosInstance.get(`/quiz/random?count=${count}`, {
    headers: {
      Authorization: `Bearer ${token}`, // Thêm token vào header Authorization
    },
  });
};

// Tính điểm sau khi làm quiz
export const submitQuiz = (answers) => {
  const token = localStorage.getItem("token"); // Lấy token từ localStorage

  if (!token) {
    console.error("No token found!");
    return Promise.reject("No token found!");
  }

  return axiosInstance.post(
    "/quiz/calculate-score",
    {
      answers, // Dữ liệu bài làm từ người dùng
    },
    {
      headers: {
        Authorization: `Bearer ${token}`, // Thêm token vào header Authorization
      },
    }
  );
};

// Đăng nhập người dùng
export const loginUser = async (email, password) => {
  try {
    const response = await axiosInstance.post("/auth/login", {
      email,
      password,
    });

    const data = response.data;
    return data;
  } catch (error) {
    throw new Error("Đã có lỗi xảy ra. Vui lòng thử lại sau!");
  }
};

export const registerUser = async (username, email, password) => {
    try {
      const response = await axios.post("/auth/register", {
        username,
        email,
        password,
      });
      console.log("Response:", response);  // Log kết quả phản hồi từ API
      return response.data;
    } catch (err) {
      console.log("Error:", err);  // Log lỗi nếu có
      throw new Error("Có lỗi xảy ra: " + (err.response?.data?.message || err.message));
    }
  };