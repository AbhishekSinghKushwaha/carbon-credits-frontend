import React from 'react';
import Navbar from '../../components/navbar';
import Link from 'next/link';

const Login: React.FC = () => {
  return (
    <div>
      <Navbar />
      <div className="container mx-auto p-4 text-center">
        <h1 className="text-2xl font-bold mb-4">Login</h1>
        <p className="mb-4">For demo purposes, use these links to access dashboards:</p>
        <Link href="/employee/dashboard?employeeId=67f80b8c6e1f34c1b7e34420" className="bg-blue-500 text-white p-2 mr-2">
          Employee Dashboard
        </Link>
        <Link href="/employeer/dashboard?employerId=67f808cd0d60fcbb34026059" className="bg-green-500 text-white p-2">
          Employer Dashboard
        </Link>
        <p className="mt-4 text-gray-600">
          In a real app, replace this with a proper login form and authentication.
        </p>
      </div>
    </div>
  );
};

export default Login;