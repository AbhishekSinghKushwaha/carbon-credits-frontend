import React from 'react';
import Navbar from '../components/navbar';
import Link from 'next/link';

const Home: React.FC = () => {
  return (
    <div>
      <Navbar />
      <div className="container mx-auto p-4 text-center">
        <h1 className="text-3xl font-bold mb-4">Welcome to Carbon Credits Platform</h1>
        <p className="mb-4">Join as an employee or employer to start tracking and trading carbon credits.</p>
        <Link href="/employee/register" className="bg-blue-500 text-white p-2 mr-2">
          Register as Employee
        </Link>
        <Link href="/employeer/register" className="bg-green-500 text-white p-2">
          Register as Employer
        </Link>
      </div>
    </div>
  );
};

export default Home;