import { useState, useEffect } from "react";
import axios from "axios";

const Dashboard = () => {
  const [vocabList, setVocabList] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [totalCount, setTotalCount] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(10);

  // Fetch vocab list with pagination
  useEffect(() => {
    const fetchVocab = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get(
          `http://localhost:5001/api/vocab?page=${currentPage}&limit=${pageSize}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setVocabList(response.data.vocabs);
        setTotalCount(response.data.totalCount);
      } catch (err) {
        console.error(err);
      }
    };
    fetchVocab();
  }, [currentPage, pageSize]);

  // Handle search query change
  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  // Filtered vocab list based on search query
  const filteredVocabList = vocabList.filter((vocab) =>
    vocab.hanzi.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Pagination Logic
  const totalPages = Math.ceil(totalCount / pageSize);

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <h2 className="text-4xl font-bold text-center mb-8 text-green-600">Dashboard</h2>

      <div className="flex justify-center mb-6">
        <input
          type="text"
          placeholder="Search by Hanzi"
          value={searchQuery}
          onChange={handleSearchChange}
          className="w-1/3 p-3 border rounded-lg shadow-md focus:outline-none focus:ring-2 focus:ring-green-500"
        />
      </div>

      <p className="text-center mb-8 text-lg font-semibold">Total Vocab: {totalCount}</p>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredVocabList.map((vocab) => (
          <div
            key={vocab._id}
            className="bg-white p-6 rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-200"
          >
            <h3 className="text-2xl font-semibold text-green-600">{vocab.hanzi}</h3>
            <p className="text-sm text-gray-700">{vocab.pinyin}</p>
            <p className="text-sm text-gray-700">{vocab.meaning}</p>
          </div>
        ))}
      </div>

      {/* Pagination Controls */}
      <div className="flex justify-center mt-6">
        <button
          onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
          className="px-4 py-2 bg-green-500 text-white rounded-l-md hover:bg-green-600"
        >
          Previous
        </button>
        <span className="px-4 py-2 flex items-center justify-center">{`Page ${currentPage} of ${totalPages}`}</span>
        <button
          onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
          className="px-4 py-2 bg-green-500 text-white rounded-r-md hover:bg-green-600"
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default Dashboard;
