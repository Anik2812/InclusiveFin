import React from 'react';
import { BrowserRouter as Router, Route, Link, Routes } from 'react-router-dom';
import { ChartBar, Users, CreditCard, GraduationCap, Target } from 'lucide-react';
import Home from './components/Home';
import Education from './components/Education';
import LendingCircle from './components/LendingCircle';
import Marketplace from './components/Marketplace';
import CreditScore from './components/CreditScore';
import FinancialGoals from './components/FinancialGoals';
import { AuthProvider } from './context/AuthContext';
import Login from './components/Login';
import Register from './components/Register';

const App = () => {
  return (
    <AuthProvider>
    <Router>
      
      <div className="min-h-screen bg-gray-100">
        <nav className="bg-blue-600 text-white p-4">
          <div className="container mx-auto flex justify-between items-center">
            <h1 className="text-2xl font-bold">InclusiveFin</h1>
            <ul className="flex space-x-4">
              <li><Link to="/" className="hover:text-blue-200">Home</Link></li>
              <li><Link to="/education" className="hover:text-blue-200">Education</Link></li>
              <li><Link to="/lending" className="hover:text-blue-200">Lending Circle</Link></li>
              <li><Link to="/marketplace" className="hover:text-blue-200">Microgrants</Link></li>
              <li><Link to="/credit-score" className="hover:text-blue-200">Credit Score</Link></li>
              <li><Link to="/goals" className="hover:text-blue-200">Financial Goals</Link></li>
            </ul>
          </div>
        </nav>

        <main className="container mx-auto mt-8 p-4">
        <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/education" element={<Education />} />
              <Route path="/lending" element={<LendingCircle />} />
              <Route path="/marketplace" element={<Marketplace />} />
              <Route path="/credit-score" element={<CreditScore />} />
              <Route path="/goals" element={<FinancialGoals />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
            </Routes>
        </main>

        <footer className="bg-blue-600 text-white p-4 mt-8">
          <div className="container mx-auto text-center">
            <p>&copy; 2024 InclusiveFin. All rights reserved.</p>
          </div>
        </footer>
      </div>
    </Router>
    </AuthProvider>
  );
};

export default App;
