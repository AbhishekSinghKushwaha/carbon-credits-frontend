import React, { useEffect, useState } from 'react';
import { apiCall } from '../utils/api';

interface Employer {
  _id: string;
  name: string;
  credits: number;
  bankApproved: boolean;
}

interface Employee {
  _id: string;
  name: string;
  credits: number;
}

const EmployerDashboard: React.FC<{ employerId: string }> = ({ employerId }) => {
  const [employer, setEmployer] = useState<Employer | null>(null);
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [tradePartnerId, setTradePartnerId] = useState('');
  const [tradeCredits, setTradeCredits] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEmployer = async () => {
      const response = await apiCall<{ employer: Employer; employees: Employee[] }>(
        `/api/employers/${employerId}`
      );
      if (response.data) {
        setEmployer(response.data.employer);
        setEmployees(response.data.employees);
      }
      setLoading(false);
    };
    fetchEmployer();
  }, [employerId]);

  const handleTrade = async () => {
    const response = await apiCall<{ message: string }>(
      '/api/employers/trade',
      'POST',
      { sellerId: employerId, buyerId: tradePartnerId, credits: tradeCredits }
    );
    if (response.data) {
      alert(response.data.message);
      window.location.reload(); // Refresh to update credits
    } else {
      alert(response.error);
    }
  };

  if (loading) return <p className="text-center">Loading...</p>;

  return (
    <div className="container mx-auto p-4">
      <h2 className="text-2xl font-bold mb-4">Employer Dashboard</h2>
      {employer ? (
        <>
          <p>Name: {employer.name}</p>
          <p>Credits: {employer.credits}</p>
          <p>Bank Approved: {employer.bankApproved ? 'Yes' : 'No'}</p>
          <h3 className="text-xl mt-4">Employees</h3>
          <ul>
            {employees.map((emp) => (
              <li key={emp._id}>
                {emp.name} - Credits: {emp.credits}
              </li>
            ))}
          </ul>
          <h3 className="text-xl mt-4">Trade Credits</h3>
          <input
            type="text"
            value={tradePartnerId}
            onChange={(e) => setTradePartnerId(e.target.value)}
            placeholder="Buyer Employer ID"
            className="border p-2 mr-2"
          />
          <input
            type="number"
            value={tradeCredits}
            onChange={(e) => setTradeCredits(Number(e.target.value))}
            placeholder="Credits to Trade"
            className="border p-2 mr-2"
          />
          <button onClick={handleTrade} className="bg-blue-500 text-white p-2">
            Trade
          </button>
        </>
      ) : (
        <p>Employer not found</p>
      )}
    </div>
  );
};

export default EmployerDashboard;