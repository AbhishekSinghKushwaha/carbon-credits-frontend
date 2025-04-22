"use client";
import React, { useState } from 'react';
import Navbar from '../../components/navbar';
import { apiCall } from '../../utils/api';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../utils/authContext';

interface LoginResponse {
  message: string;
  token: string;
  user: {
    id: string;
    userName: string;
    role: 'employee' | 'employer' | 'admin';
  };
}

const Login: React.FC = () => {
  const [userName, setUserName] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<'employee' | 'employer' | 'admin'>('employee');
  const [message, setMessage] = useState('');
  const router = useRouter();
  const { setUser, loading } = useAuth();

  const handleLogin = async () => {
    const endpoint = role === 'admin' ? '/api/admin/login' : role === 'employer' ? '/api/employers/login' : '/api/employees/login';
    const response = await apiCall<LoginResponse>(endpoint, 'POST', { userName, password });

    if (response.data) {
      setMessage(response.data.message);
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.user));
      setUser(response.data.user);

      if (role === 'admin') {
        router.push(`/admin/dashboard?adminUserName=${response.data.user.userName}`);
      } else if (role === 'employer') {
        router.push(`/employeer/dashboard?employerId=${response.data.user.id}`);
      } else {
        router.push(`/employee/dashboard?employeeId=${response.data.user.id}`);
      }
    } else {
      setMessage(response.error || 'Login failed');
    }
  };

  if (loading) {
    return <p className="text-center p-4">Loading authentication...</p>;
  }

  return (
    <div>
      <Navbar />
      <div className="container mx-auto p-4">
        <h1 className="text-2xl font-bold mb-4">Login</h1>
        <select
          value={role}
          onChange={(e) => setRole(e.target.value as 'employee' | 'employer' | 'admin')}
          className="border p-2 mb-2 w-full"
        >
          <option value="employee">Employee</option>
          <option value="employer">Employer</option>
          <option value="admin">Admin</option>
        </select>
        <input
          type="text"
          value={userName}
          onChange={(e) => setUserName(e.target.value)}
          placeholder="Username"
          className="border p-2 mb-2 w-full"
        />
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
          className="border p-2 mb-2 w-full"
        />
        <button type='submit' onClick={handleLogin} className="bg-blue-500 text-white p-2">
          Login
        </button>
        {message && <p className="mt-2 text-green-600">{message}</p>}
      </div>
    </div>
  );
};

export default Login;