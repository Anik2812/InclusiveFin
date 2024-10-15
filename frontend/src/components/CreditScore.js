import React, { useState } from 'react';
import axios from 'axios';

const CreditScore = () => {
  const [userId, setUserId] = useState('');
  const [creditScore, setCreditScore] = useState(null);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:5000/api/credit-score', { userId });
      setCreditScore(response.data.creditScore);
      setError('');
    } catch (error) {
      console.error('Error fetching credit score:', error);
      setError('Error fetching credit score. Please try again.');
      setCreditScore(null);
    }
  };

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Inclusive Credit Scoring</h2>
      <form onSubmit={handleSubmit} className="mb-4">
        <input
          type="text"
          value={userId}
          onChange={(e) => setUserId(e.target.value)}
          placeholder="Enter User ID"
          className="p-2 border rounded mr-2"
        />
        <button type="submit" className="bg-blue-500 text-white p-2 rounded">
          Get Credit Score
        </button>
      </form>
      {error && <p className="text-red-500 mb-4">{error}</p>}
      {creditScore !== null && (
        <div className="bg-white p-4 rounded-lg shadow">
          <h3 className="text-xl font-semibold mb-2">Your Inclusive Credit Score</h3>
          <p className="text-3xl font-bold text-blue-600">{creditScore}</p>
          <p className="mt-2">
            This score takes into account various factors of your financial profile,
            providing a more comprehensive assessment of your creditworthiness.
          </p>
        </div>
      )}
    </div>
  );
};

export default CreditScore;