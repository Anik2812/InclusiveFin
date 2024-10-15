import React from 'react';
import { ChartBar, Users, CreditCard, GraduationCap } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const FeatureCard = ({ icon, title, description }) => (
  <div className="bg-white p-6 rounded-lg shadow-md transition-transform hover:scale-105">
    <div className="flex justify-center mb-4">{icon}</div>
    <h3 className="text-xl font-semibold mb-2">{title}</h3>
    <p>{description}</p>
  </div>
);

const StatCard = ({ value, label }) => (
  <div className="bg-blue-500 text-white p-4 rounded-lg shadow-md text-center">
    <p className="text-3xl font-bold mb-1">{value}</p>
    <p className="text-sm">{label}</p>
  </div>
);

const Home = () => {
  const { user, loading } = useAuth();

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <section className="bg-blue-600 text-white py-20 mb-12">
        <div className="container mx-auto text-center">
          <h1 className="text-4xl font-bold mb-4">Welcome to InclusiveFin</h1>
          <p className="text-xl mb-8">Empowering communities through inclusive financial solutions</p>
          {!user && (
            <Link to="/register" className="bg-white text-blue-600 px-6 py-3 rounded-full font-semibold hover:bg-blue-100 transition-colors">
              Get Started
            </Link>
          )}
        </div>
      </section>

      <div className="container mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          <StatCard value="10,000+" label="Users Empowered" />
          <StatCard value="$5M+" label="Funds Distributed" />
          <StatCard value="500+" label="Community Lending Circles" />
          <StatCard value="1,000+" label="Businesses Supported" />
        </div>

        <h2 className="text-3xl font-bold mb-8 text-center">Our Services</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <FeatureCard
            icon={<GraduationCap className="w-12 h-12 text-blue-500" />}
            title="Financial Education"
            description="Access multilingual resources to improve your financial literacy"
          />
          <FeatureCard
            icon={<Users className="w-12 h-12 text-green-500" />}
            title="Community Lending"
            description="Join peer-to-peer lending circles to access affordable loans"
          />
          <FeatureCard
            icon={<ChartBar className="w-12 h-12 text-yellow-500" />}
            title="Microgrant Marketplace"
            description="Connect with investors to fund your small business"
          />
          <FeatureCard
            icon={<CreditCard className="w-12 h-12 text-purple-500" />}
            title="Inclusive Credit Scoring"
            description="Get a fair credit assessment based on your unique financial situation"
          />
        </div>
      </div>
    </div>
  );
};

export default Home;