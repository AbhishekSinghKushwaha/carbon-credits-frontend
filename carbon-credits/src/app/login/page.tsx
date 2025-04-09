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
        <Link href="/employee/dashboard?employeeId=67f6ace85506dface90585aa" className="bg-blue-500 text-white p-2 mr-2">
          Employee Dashboard (ID: example_employee_id)
        </Link>
        <Link href="/employeer/dashboard?employerId=67f6ac8b98901f765d57b053" className="bg-green-500 text-white p-2">
          Employer Dashboard (ID: example_employer_id)
        </Link>
        <p className="mt-4 text-gray-600">
          In a real app, replace this with a proper login form and authentication.
        </p>
      </div>
    </div>
  );
};

export default Login;