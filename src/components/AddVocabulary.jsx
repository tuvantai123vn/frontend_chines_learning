import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { addWord, fetchTranslation, fetchPinyin } from '../api'; // Import API functions

const AddVocabulary = () => {
  const navigate = useNavigate();
  const [vocabularies, setVocabularies] = useState([{ hanzi: '', pinyin: '', meaning: '' }]);
  const [message, setMessage] = useState('');
  const [currentHanzi, setCurrentHanzi] = useState(''); // Trạng thái riêng biệt cho hanzi
  const [debouncedHanzi, setDebouncedHanzi] = useState(''); // Trạng thái để debounce

  // Hàm xử lý thay đổi khi nhập từ Hán tự
  const handleChange = async (index, e) => {
    const { name, value } = e.target;

    // Cập nhật trạng thái của hanzi
    if (name === 'hanzi') {
      setCurrentHanzi(value);
    }

    // Cập nhật lại danh sách vocabularies
    const updatedVocabularies = [...vocabularies];
    updatedVocabularies[index][name] = value;
    setVocabularies(updatedVocabularies);
  };

  // Hàm debounce: cập nhật giá trị hanzi đã thay đổi sau một khoảng thời gian
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setDebouncedHanzi(currentHanzi); // Cập nhật giá trị sau khi có độ trễ
    }, 1000); // Thời gian debounce: 1000ms = 1s

    // Cleanup function để hủy timeout nếu người dùng nhập quá nhanh
    return () => {
      clearTimeout(timeoutId);
    };
  }, [currentHanzi]);

  // Hàm gọi API khi giá trị hanzi thay đổi (sau debounce)
  useEffect(() => {
    const fetchData = async () => {
      if (debouncedHanzi.trim()) {
        try {
          // Lấy Pinyin và Nghĩa từ API
          const meaning = await fetchTranslation(debouncedHanzi);
          const pinyin = await fetchPinyin(debouncedHanzi);

          // Cập nhật lại vocabularies
          const updatedVocabularies = [...vocabularies];
          updatedVocabularies[0].meaning = meaning || '';
          updatedVocabularies[0].pinyin = pinyin || '';
          setVocabularies(updatedVocabularies);
        } catch (error) {
          console.error('Lỗi khi gọi API:', error);
        }
      }
    };

    fetchData();
  }, [debouncedHanzi, vocabularies]);

  // Hàm thêm từ vựng mới vào
  const handleAddVocabulary = () => {
    setVocabularies([...vocabularies, { hanzi: '', pinyin: '', meaning: '' }]);
  };

  const handleRemoveVocabulary = (index) => {
    const updatedVocabularies = vocabularies.filter((_, i) => i !== index);
    setVocabularies(updatedVocabularies);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const filteredVocabularies = vocabularies.filter(
      (item) => item.hanzi.trim() && item.meaning.trim()
    );

    if (filteredVocabularies.length === 0) {
      setMessage('Vui lòng nhập ít nhất một từ vựng.');
      return;
    }

    try {
      // Gọi API để thêm từ vựng
      const response = await addWord({ vocabularies: filteredVocabularies });

      if (response.status === 200) {
        setMessage('Lưu từ vựng thành công!');
        setTimeout(() => navigate('/dashboard'), 1500);
      } else {
        setMessage('Có lỗi xảy ra khi lưu!');
      }
    } catch (error) {
      console.error('Error:', error);
      setMessage('Lỗi kết nối máy chủ.');
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6 text-center text-green-700">Thêm Từ Vựng</h1>

      {message && (
        <div className="mb-4 p-3 bg-yellow-100 text-yellow-800 rounded shadow text-center">
          {message}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        {vocabularies.map((vocabulary, index) => (
          <div key={index} className="mb-4 border p-4 rounded-xl bg-white shadow-sm">
            <div className="grid grid-cols-3 gap-4">
              <input
                type="text"
                name="hanzi"
                placeholder="Hán tự"
                value={vocabulary.hanzi}
                onChange={(e) => handleChange(index, e)}
                className="p-2 border rounded-md w-full focus:ring-green-500"
              />
              <input
                type="text"
                name="pinyin"
                placeholder="Pinyin"
                value={vocabulary.pinyin}
                onChange={(e) => handleChange(index, e)}
                className="p-2 border rounded-md w-full focus:ring-green-500"
              />
              <input
                type="text"
                name="meaning"
                placeholder="Nghĩa tiếng Việt"
                value={vocabulary.meaning}
                onChange={(e) => handleChange(index, e)}
                className="p-2 border rounded-md w-full focus:ring-green-500"
              />
            </div>

            <button
              type="button"
              onClick={() => handleRemoveVocabulary(index)}
              className="text-red-500 mt-2"
            >
              Xóa dòng
            </button>
          </div>
        ))}

        <button
          type="button"
          onClick={handleAddVocabulary}
          className="w-full bg-blue-500 text-white font-semibold py-3 rounded-lg mt-4 hover:bg-blue-600 shadow-md"
        >
          Thêm Từ Vựng
        </button>

        <button
          type="submit"
          className="w-full bg-green-600 text-white font-semibold py-3 rounded-lg mt-4 hover:bg-green-700 shadow-md"
        >
          Lưu từ vựng
        </button>
      </form>
    </div>
  );
};

export default AddVocabulary;
