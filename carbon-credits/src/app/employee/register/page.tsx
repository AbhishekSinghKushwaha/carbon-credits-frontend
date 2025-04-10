"use client";
import React, { useState, useEffect } from 'react';
import Navbar from '../../../components/navbar';
import { apiCall } from '../../../utils/api';
import { useRouter } from 'next/navigation';

interface Employer {
  userName: string;
  name: string;
}

const EmployeeRegister: React.FC = () => {
  const [name, setName] = useState('');
  const [userName, setUserName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [employerUserName, setEmployerUserName] = useState('');
  const [homeLocation, setHomeLocation] = useState('');
  const [workLocation, setWorkLocation] = useState('');
  const [message, setMessage] = useState('');
  const [employers, setEmployers] = useState<Employer[]>([]);
  const router = useRouter();

  useEffect(() => {
    const fetchEmployers = async () => {
      const response = await apiCall<Employer[]>('/api/employers');
      if (response.data) {
        setEmployers(response.data);
        if (response.data.length > 0) {
          setEmployerUserName(response.data[0].userName); // Default to first employer
        }
      }
    };
    fetchEmployers();
  }, []);

  const handleRegister = async () => {
    const response = await apiCall<{ message: string; employee: { _id: string } }>(
      '/api/employees/register',
      'POST',
      { name, userName, email, password, employerUserName, homeLocation, workLocation }
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
        <select
          value={employerUserName}
          onChange={(e) => setEmployerUserName(e.target.value)}
          className="border p-2 mb-2 w-full"
        >
          {employers.map((employer) => (
            <option key={employer.userName} value={employer.userName}>
              {employer.name} ({employer.userName})
            </option>
          ))}
        </select>
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