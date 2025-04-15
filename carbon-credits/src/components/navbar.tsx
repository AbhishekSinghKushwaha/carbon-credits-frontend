"use client";
import React from 'react';
import Link from 'next/link';
import { useAuth } from '../utils/authContext';

const Navbar: React.FC = () => {
  const { user, logout, loading } = useAuth();

  if (loading) {
    return (
      <nav className="bg-gray-800 p-4">
        <div className="container mx-auto flex justify-between items-center">
          <Link href="/" className="text-white text-lg font-bold">
            Carbon Credits
          </Link>
          <div>Loading...</div>
        </div>
      </nav>
    );
  }

  return (
    <nav className="bg-gray-800 p-4">
      <div className="container mx-auto flex justify-between items-center">
        <Link href="/" className="text-white text-lg font-bold">
          Carbon Credits
        </Link>
        <div>
          {user ? (
            <>
              <span className="text-white mr-4">
                Welcome, {user.userName} ({user.role})
              </span>
              {user.role === 'admin' && (
                <Link href={`/admin/dashboard?adminUserName=${user.userName}`} className="text-white mr-4">
                  Dashboard
                </Link>
              )}
              {user.role === 'employer' && (
                <Link href={`/employeer/dashboard?employerId=${user.id}`} className="text-white mr-4">
                  Dashboard
                </Link>
              )}
              {user.role === 'employee' && (
                <Link href={`/employee/dashboard?employeeId=${user.id}`} className="text-white mr-4">
                  Dashboard
                </Link>
              )}
              <Link href="/logout" className="text-white" onClick={logout}>
                Logout
              </Link>
            </>
          ) : (
            <>
              <Link href="/login" className="text-white mr-4">
                Login
              </Link>
              <Link href="/login?role=admin" className="text-white mr-4">
                Admin Login
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;