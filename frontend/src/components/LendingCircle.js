import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

const LendingCircle = () => {
  const [circles, setCircles] = useState([]);
  const [name, setName] = useState('');
  const [totalAmount, setTotalAmount] = useState('');
  const [contributionAmount, setContributionAmount] = useState('');
  const [duration, setDuration] = useState('');
  const { user, loading } = useAuth();

  useEffect(() => {
    const fetchCircles = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/lending-circles');
        setCircles(response.data);
      } catch (error) {
        console.error('Error fetching lending circles:', error);
      }
    };

    if (!loading) {
      fetchCircles();
    }
  }, [loading]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user) {
      console.error('User not authenticated');
      return;
    }
    try {
      const response = await axios.post('http://localhost:5000/api/lending-circles', {
        name,
        totalAmount: parseFloat(totalAmount),
        contributionAmount: parseFloat(contributionAmount),
        duration: parseInt(duration),
        members: [user._id],
        status: 'Open',
      });
      setCircles([...circles, response.data]);
      setName('');
      setTotalAmount('');
      setContributionAmount('');
      setDuration('');
    } catch (error) {
      console.error('Error creating lending circle:', error);
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!user) {
    return <div>Please log in to view and manage lending circles.</div>;
  }

  return (
    <div>
      <h2 className="text-3xl font-bold mb-8">Community Lending Circles</h2>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <h3 className="text-2xl font-semibold mb-4">Active Circles</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {circles.map((circle) => (
              <div key={circle._id} className="bg-white p-6 rounded-lg shadow-md">
                <h4 className="text-xl font-semibold mb-2">{circle.name}</h4>
                <p className="mb-2">Total Amount: ${circle.totalAmount}</p>
                <p className="mb-2">Contribution: ${circle.contributionAmount}</p>
                <p className="mb-2">Duration: {circle.duration} months</p>
                <p className="mb-2">Status: {circle.status}</p>
                <p className="text-sm text-gray-500">Members: {circle.members.length}</p>
              </div>
            ))}
          </div>
        </div>
        <div>
          <h3 className="text-2xl font-semibold mb-4">Create New Circle</h3>
          <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-md">
            <div className="mb-4">
              <label htmlFor="name" className="block mb-1">Circle Name</label>
              <input
                type="text"
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="w-full p-2 border rounded"
              />
            </div>
            <div className="mb-4">
              <label htmlFor="totalAmount" className="block mb-1">Total Amount ($)</label>
              <input
                type="number"
                id="totalAmount"
                value={totalAmount}
                onChange={(e) => setTotalAmount(e.target.value)}
                required
                className="w-full p-2 border rounded"
              />
            </div>
            <div className="mb-4">
              <label htmlFor="contributionAmount" className="block mb-1">Monthly Contribution ($)</label>
              <input
                type="number"
                id="contributionAmount"
                value={contributionAmount}
                onChange={(e) => setContributionAmount(e.target.value)}
                required
                className="w-full p-2 border rounded"
              />
            </div>
            <div className="mb-4">
              <label htmlFor="duration" className="block mb-1">Duration (months)</label>
              <input
                type="number"
                id="duration"
                value={duration}
                onChange={(e) => setDuration(e.target.value)}
                required
                className="w-full p-2 border rounded"
              />
            </div>
            <button type="submit" className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600">
              Create Circle
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default LendingCircle;