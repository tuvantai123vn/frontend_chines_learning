import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

// Debounce function
const debounce = (func, delay) => {
  let timeout;
  return (...args) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), delay);
  };
};

// Throttle function
const throttle = (func, limit) => {
  let lastFunc;
  let lastRan;
  return (...args) => {
    const context = this;
    if (!lastRan) {
      func.apply(context, args);
      lastRan = Date.now();
    } else {
      clearTimeout(lastFunc);
      lastFunc = setTimeout(() => {
        if (Date.now() - lastRan >= limit) {
          func.apply(context, args);
          lastRan = Date.now();
        }
      }, limit - (Date.now() - lastRan));
    }
  };
};

const AddVocabulary = () => {
  const navigate = useNavigate();
  const [vocabularies, setVocabularies] = useState([{ hanzi: '', pinyin: '', meaning: '' }]);
  const [message, setMessage] = useState('');

  // Fetch translation (meaning)
  const fetchTranslation = async (hanziValue, index) => {
    try {
      const response = await fetch(
        `https://translate.googleapis.com/translate_a/single?client=gtx&sl=zh&tl=vi&dt=t&q=${encodeURIComponent(hanziValue)}`
      );
      const data = await response.json();
      const meaning = data[0]?.map(item => item[0]).join(' ') || '';

      const updatedVocabularies = [...vocabularies];
      updatedVocabularies[index].meaning = meaning;
      setVocabularies(updatedVocabularies);
    } catch (error) {
      console.error('Lỗi khi dịch nghĩa:', error);
    }
  };

  // Fetch Pinyin
  const fetchPinyin = async (hanziValue, index) => {
    try {
      const response = await fetch('http://localhost:5001/api/vocab/convert', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ hanzi: hanziValue }),
      });

      const data = await response.json();
      const pinyin = data.pinyin || '';

      const updatedVocabularies = [...vocabularies];
      updatedVocabularies[index].pinyin = pinyin;
      setVocabularies(updatedVocabularies);
    } catch (error) {
      console.error('Lỗi khi lấy pinyin:', error);
    }
  };

  // Handle adding new vocabulary
  const handleAddVocabulary = () => {
    setVocabularies([...vocabularies, { hanzi: '', pinyin: '', meaning: '' }]);
  };

  // Handle change for any input
  const handleChange = (index, e) => {
    const { name, value } = e.target;
    const updatedVocabularies = [...vocabularies];
    updatedVocabularies[index][name] = value;
    setVocabularies(updatedVocabularies);

    // If the input is for Hanzi, we need to fetch Pinyin and meaning
    if (name === 'hanzi' && value.trim()) {
      fetchTranslation(value, index);
      fetchPinyin(value, index);
    }
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
      const response = await fetch('http://localhost:5001/api/vocab', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({ vocabularies: filteredVocabularies })
      });

      if (response.ok) {
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
