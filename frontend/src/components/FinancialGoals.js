import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { useAuth } from '../context/AuthContext';

const FinancialGoals = () => {
  const [goals, setGoals] = useState([]);
  const [newGoal, setNewGoal] = useState({ name: '', targetAmount: '', deadline: '', category: '' });
  const { user, loading } = useAuth();

  useEffect(() => {
    const fetchGoals = async () => {
      if (!user) return;
      try {
        const response = await axios.get('http://localhost:5000/api/financial-goals');
        setGoals(response.data);
      } catch (error) {
        console.error('Error fetching financial goals:', error);
      }
    };

    if (!loading) {
      fetchGoals();
    }
  }, [user, loading]);

  const handleInputChange = (e) => {
    setNewGoal({ ...newGoal, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user) {
      console.error('User not authenticated');
      return;
    }
    try {
      const response = await axios.post('http://localhost:5000/api/financial-goals', {
        ...newGoal,
        currentAmount: 0,
        targetAmount: parseFloat(newGoal.targetAmount),
      });
      setGoals([...goals, response.data]);
      setNewGoal({ name: '', targetAmount: '', deadline: '', category: '' });
    } catch (error) {
      console.error('Error creating financial goal:', error);
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!user) {
    return <div>Please log in to view and manage your financial goals.</div>;
  }

  return (
    <div className="container mx-auto px-4">
      <h2 className="text-2xl font-bold mb-4">Financial Goals</h2>
      <form onSubmit={handleSubmit} className="mb-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input
            type="text"
            name="name"
            value={newGoal.name}
            onChange={handleInputChange}
            placeholder="Goal Name"
            className="p-2 border rounded"
            required
          />
          <input
            type="number"
            name="targetAmount"
            value={newGoal.targetAmount}
            onChange={handleInputChange}
            placeholder="Target Amount"
            className="p-2 border rounded"
            required
          />
          <input
            type="date"
            name="deadline"
            value={newGoal.deadline}
            onChange={handleInputChange}
            className="p-2 border rounded"
            required
          />
          <select
            name="category"
            value={newGoal.category}
            onChange={handleInputChange}
            className="p-2 border rounded"
            required
          >
            <option value="">Select Category</option>
            <option value="Savings">Savings</option>
            <option value="Investment">Investment</option>
            <option value="Debt Repayment">Debt Repayment</option>
            <option value="Education">Education</option>
            <option value="Other">Other</option>
          </select>
        </div>
        <button type="submit" className="mt-4 bg-blue-500 text-white p-2 rounded">
          Add Goal
        </button>
      </form>

      <div className="mb-8">
        <h3 className="text-xl font-semibold mb-4">Your Financial Goals</h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={goals}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="currentAmount" fill="#8884d8" name="Current Amount" />
            <Bar dataKey="targetAmount" fill="#82ca9d" name="Target Amount" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {goals.map((goal) => (
          <div key={goal._id} className="bg-white p-4 rounded-lg shadow">
            <h4 className="text-lg font-semibold mb-2">{goal.name}</h4>
            <p className="mb-1">Category: {goal.category}</p>
            <p className="mb-1">Target: ${goal.targetAmount}</p>
            <p className="mb-1">Current: ${goal.currentAmount}</p>
            <p className="mb-1">Deadline: {new Date(goal.deadline).toLocaleDateString()}</p>
            <div className="mt-2 bg-gray-200 rounded-full h-2.5">
              <div
                className="bg-blue-600 h-2.5 rounded-full"
                style={{ width: `${(goal.currentAmount / goal.targetAmount) * 100}%` }}
              ></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FinancialGoals;