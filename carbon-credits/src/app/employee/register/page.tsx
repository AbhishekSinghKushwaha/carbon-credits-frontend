"use client";
import React, { useState } from 'react';
import Navbar from '../../../components/navbar';
import { apiCall } from '../../../utils/api';
import { useRouter } from 'next/navigation';

const EmployeeRegister: React.FC = () => {
  const [name, setName] = useState('');
  const [employerId, setEmployerId] = useState('');
  const [homeLocation, setHomeLocation] = useState('');
  const [workLocation, setWorkLocation] = useState('');
  const [message, setMessage] = useState('');
  const router = useRouter();

  const handleRegister = async () => {
    const response = await apiCall<{ message: string; employee: { _id: string } }>(
      '/api/employees/register',
      'POST',
      { name, employerId, homeLocation, workLocation }
    );
    if (response.data) {
      setMessage(response.data.message);
      router.push(`/employee/dashboard?employeeId=${response.data.employee._id}`);
    } else {
      setMessage(response.error || 'Registration failed');
    }
  };

  return (
    <div>
      <Navbar />
      <div className="container mx-auto p-4">
        <h1 className="text-2xl font-bold mb-4">Employee Registration</h1>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Name"
          className="border p-2 mb-2 w-full"
        />
        <input
          type="text"
          value={employerId}
          onChange={(e) => setEmployerId(e.target.value)}
          placeholder="Employer ID"
          className="border p-2 mb-2 w-full"
        />
        <input
          type="text"
          value={homeLocation}
          onChange={(e) => setHomeLocation(e.target.value)}
          placeholder="Home Location"
          className="border p-2 mb-2 w-full"
        />
        <input
          type="text"
          value={workLocation}
          onChange={(e) => setWorkLocation(e.target.value)}
          placeholder="Work Location"
          className="border p-2 mb-2 w-full"
        />
        <button onClick={handleRegister} className="bg-blue-500 text-white p-2">
          Register
        </button>
        {message && <p className="mt-2 text-green-600">{message}</p>}
      </div>
    </div>
  );
};

export default EmployeeRegister;