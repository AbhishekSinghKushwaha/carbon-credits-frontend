"use client";
import React, { useState } from 'react';
import Navbar from '../../../components/navbar';
import { apiCall } from '../../../utils/api';
import { useRouter } from 'next/navigation';

const EmployerRegister: React.FC = () => {
  const [name, setName] = useState('');
  const [userName, setUserName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const router = useRouter();

  const handleRegister = async () => {
    const response = await apiCall<{ message: string; employer: { _id: string } }>(
      '/api/employers/register',
      'POST',
      { name, userName, email, password }
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
         <input
          type="text"
          value={userName}
          onChange={(e) => setUserName(e.target.value)}
          placeholder="Username"
          className="border p-2 mb-2 w-full"
        />
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email"
          className="border p-2 mb-2 w-full"
        />
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
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