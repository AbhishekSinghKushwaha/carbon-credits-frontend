"use client";
import React, { useState } from 'react';
import Navbar from '../../../components/navbar';
import { apiCall } from '../../../utils/api';
import { useRouter } from 'next/navigation';

const EmployerRegister: React.FC = () => {
  const [name, setName] = useState('');
  const [message, setMessage] = useState('');
  const router = useRouter();

  const handleRegister = async () => {
    const response = await apiCall<{ message: string; employer: { _id: string } }>(
      '/api/employers/register',
      'POST',
      { name }
    );
    if (response.data) {
      setMessage(response.data.message);
      router.push(`/employeer/dashboard?employerId=${response.data.employer._id}`);
    } else {
      setMessage(response.error || 'Registration failed');
    }
  };

  return (
    <div>
      <Navbar />
      <div className="container mx-auto p-4">
        <h1 className="text-2xl font-bold mb-4">Employer Registration</h1>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Employer Name"
          className="border p-2 mb-2 w-full"
        />
        <button onClick={handleRegister} className="bg-green-500 text-white p-2">
          Register
        </button>
        {message && <p className="mt-2 text-green-600">{message}</p>}
      </div>
    </div>
  );
};

export default EmployerRegister;