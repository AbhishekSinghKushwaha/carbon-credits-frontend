import React, { useEffect, useState } from 'react';
import { apiCall } from '../utils/api';
import CreditTracker from './creditTracker';

interface Employee {
  _id: string;
  name: string;
  credits: number;
  homeLocation: string;
  workLocation: string;
}

const EmployeeDashboard: React.FC<{ employeeId: string }> = ({ employeeId }) => {
  const [employee, setEmployee] = useState<Employee | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEmployee = async () => {
      const response = await apiCall<Employee>(`/api/employees/get/${employeeId}`);
      if (response.data) setEmployee(response.data);
      setLoading(false);
    };
    fetchEmployee();
  }, [employeeId]);

  if (loading) return <p className="text-center">Loading...</p>;

  return (
    <div className="container mx-auto p-4">
      <h2 className="text-2xl font-bold mb-4">Employee Dashboard</h2>
      {employee ? (
        <>
          <p>Name: {employee.name}</p>
          <p>Credits: {employee.credits}</p>
          <p>Home: {employee.homeLocation}</p>
          <p>Work: {employee.workLocation}</p>
          <CreditTracker employeeId={employeeId} />
        </>
      ) : (
        <p>Employee not found</p>
      )}
    </div>
  );
};

export default EmployeeDashboard;