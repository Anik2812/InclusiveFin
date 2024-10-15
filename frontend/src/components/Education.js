import React, { useState, useEffect } from 'react';
import { Search } from 'lucide-react';

const Education = () => {
  const [resources, setResources] = useState([]);
  const [filteredResources, setFilteredResources] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');

  useEffect(() => {
    // Simulated API response with real-like data
    const mockResources = [
      {
        id: 1,
        title: "Introduction to Budgeting",
        content: "Learn the basics of creating and maintaining a personal budget to achieve your financial goals.",
        language: "English",
        category: "Personal Finance"
      },
      {
        id: 2,
        title: "Understanding Credit Scores",
        content: "Discover what factors influence your credit score and how to improve it over time.",
        language: "English",
        category: "Credit"
      },
      {
        id: 3,
        title: "Investing for Beginners",
        content: "Get started with investing by learning about different investment options and strategies.",
        language: "English",
        category: "Investing"
      },
      {
        id: 4,
        title: "Ahorro e Inversión",
        content: "Aprenda los conceptos básicos del ahorro y la inversión para asegurar su futuro financiero.",
        language: "Spanish",
        category: "Personal Finance"
      },
      {
        id: 5,
        title: "Understanding Taxes",
        content: "Learn about different types of taxes and how to prepare for tax season effectively.",
        language: "English",
        category: "Taxes"
      }
    ];

    setResources(mockResources);
    setFilteredResources(mockResources);
  }, []);

  useEffect(() => {
    const results = resources.filter(resource =>
      resource.title.toLowerCase().includes(searchTerm.toLowerCase()) &&
      (selectedCategory === 'All' || resource.category === selectedCategory)
    );
    setFilteredResources(results);
  }, [searchTerm, selectedCategory, resources]);

  const categories = ['All', ...new Set(resources.map(resource => resource.category))];

  return (
    <div className="container mx-auto px-4">
      <h1 className="text-3xl font-bold mb-8">Financial Education Hub</h1>
      <div className="flex mb-4">
        <div className="relative flex-grow mr-2">
          <Search className="absolute left-3 top-3 text-gray-400" size={20} />
          <input
            type="text"
            placeholder="Search resources..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full p-2 pl-10 border rounded-l"
          />
        </div>
        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          className="p-2 border rounded-r"
        >
          {categories.map(category => (
            <option key={category} value={category}>{category}</option>
          ))}
        </select>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredResources.map((resource) => (
          <div key={resource.id} className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold mb-2">{resource.title}</h2>
            <p className="mb-4">{resource.content}</p>
            <div className="text-sm text-gray-600">
              <p>Language: {resource.language}</p>
              <p>Category: {resource.category}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Education;