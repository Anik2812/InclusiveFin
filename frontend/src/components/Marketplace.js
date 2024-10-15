import React, { useState, useEffect } from 'react';

const Marketplace = () => {
  const [grants, setGrants] = useState([]);

  useEffect(() => {
    // Simulated API response with real-like data
    const mockGrants = [
      {
        id: 1,
        businessName: "Green Thumb Gardening",
        description: "Eco-friendly landscaping service focusing on native plants and sustainable practices.",
        amountRequested: 5000,
        status: "Open",
        owner: { name: "Maria Rodriguez" }
      },
      {
        id: 2,
        businessName: "Tech Tutors",
        description: "After-school program teaching coding and robotics to underprivileged youth.",
        amountRequested: 7500,
        status: "Under Review",
        owner: { name: "David Chen" }
      },
      {
        id: 3,
        businessName: "Healthy Bites Food Truck",
        description: "Mobile kitchen serving nutritious, affordable meals in food desert areas.",
        amountRequested: 10000,
        status: "Funded",
        owner: { name: "Aisha Johnson" }
      },
      {
        id: 4,
        businessName: "Crafty Creations",
        description: "Artisan cooperative selling handmade goods from local craftspeople.",
        amountRequested: 3000,
        status: "Open",
        owner: { name: "Sarah Thompson" }
      },
      {
        id: 5,
        businessName: "EcoClean Solutions",
        description: "Environmentally friendly cleaning service using all-natural products.",
        amountRequested: 6000,
        status: "Under Review",
        owner: { name: "Michael O'Brien" }
      }
    ];

    setGrants(mockGrants);
  }, []);

  return (
    <div className="container mx-auto px-4">
      <h1 className="text-3xl font-bold mb-8">Microgrant Marketplace</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {grants.map((grant) => (
          <div key={grant.id} className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold mb-2">{grant.businessName}</h2>
            <p className="mb-4">{grant.description}</p>
            <p className="mb-2"><strong>Amount Requested:</strong> ${grant.amountRequested}</p>
            <p className="mb-2"><strong>Status:</strong> {grant.status}</p>
            <p><strong>Owner:</strong> {grant.owner.name}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Marketplace;