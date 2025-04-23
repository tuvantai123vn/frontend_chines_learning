import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import PrivateRoute from './components/PrivateRoute';
import Dashboard from './components/Dashboard';
import Quiz from './components/Quiz';
import Login from './components/Login';
import AddVocabulary from './components/AddVocabulary';
import QuizResult from "./components/QuizResult";
import HistoryPage from "./components/HistoryPage"; // Đảm bảo đường dẫn đúng

function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        {/* Public Route */}
        <Route path="/login" element={<Login />} />

        {/* Protected Routes */}
        <Route element={<PrivateRoute />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/quiz" element={<Quiz />} />
          <Route path="/addvocabulary" element={<AddVocabulary />} />
          <Route path="/quiz-result" element={<QuizResult />} />
          <Route path="/historypage" element={<HistoryPage />} />
        </Route>

        {/* Redirect tất cả các path không xác định */}
        <Route path="*" element={<Navigate to="/dashboard" />} />
      </Routes>
    </Router>
  );
}

export default App;
