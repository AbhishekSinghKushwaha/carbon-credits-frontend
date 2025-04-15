import React, { useEffect, useState } from 'react';
import { apiCall } from '../utils/api';

interface Employer {
  userName: string;
  name: string;
  bankApproved: boolean;
}

const AdminDashboard: React.FC<{ adminUserName: string }> = ({ adminUserName }) => {
  const [employers, setEmployers] = useState<Employer[]>([]);
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEmployers = async () => {
      const response = await apiCall<Employer[]>('/api/employers');
      if (response.data) {
        setEmployers(response.data);
      }
      setLoading(false);
    };
    fetchEmployers();
  }, []);

  const handleApprove = async (userName: string) => {
    const response = await apiCall<{ message: string }>(
      `/api/admin/approve-employer/${userName}`,
      'PUT'
    );
    if (response.data) {
      setMessage(response.data.message);
      setEmployers((prev) =>
        prev.map((emp) =>
          emp.userName === userName ? { ...emp, bankApproved: true } : emp
        )
      );
      setTimeout(() => setMessage(''), 3000);
    } else {
      setMessage(response.error || 'Approval failed');
    }
  };

  if (loading) return <p className="text-center">Loading...</p>;

  return (
    <div className="container mx-auto p-4">
      <h2 className="text-2xl font-bold mb-4">Admin Dashboard</h2>
      <p>Logged in as: {adminUserName}</p>
      <h3 className="text-xl mt-4">Employers</h3>
      {employers.length > 0 ? (
        <ul>
          {employers.map((employer) => (
            <li key={employer.userName} className="flex justify-between items-center p-2 border-b">
              <span>
                {employer.name} ({employer.userName}) - Approved: {employer?.bankApproved ? 'Yes' : 'No'}
              </span>
              {!employer.bankApproved && (
                <button
                  onClick={() => handleApprove(employer.userName)}
                  className="bg-green-500 text-white p-1"
                >
                  Approve
                </button>
              )}
            </li>
          ))}
        </ul>
      ) : (
        <p>No employers found</p>
      )}
      {message && <p className="mt-2 text-green-600">{message}</p>}
    </div>
  );
};

export default AdminDashboard;