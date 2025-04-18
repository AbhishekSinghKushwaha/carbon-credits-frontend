"use client";
import React, { useEffect } from 'react';
import Navbar from '../../../components/navbar';
import EmployeeDashboard from '../../../components/employeeDashboard';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '../../../utils/authContext';

const EmployeeDashboardPage: React.FC = () => {
  const router = useRouter();
  const { user, loading } = useAuth();
  const searchParams = useSearchParams();
  const employeeId = searchParams.get('employeeId');

  useEffect(() => {
    if (!loading && (!user || user.role !== 'employee')) {
      router.push('/login');
    }
  }, [user, loading, router]);

  if (loading) {
    return <p className="text-center p-4">Loading authentication...</p>;
  }

  if (!user || user.role !== 'employee') {
    return <p className="text-center p-4">Redirecting to login...</p>;
  }

  return (
    <div>
      <Navbar />
      {employeeId ? (
        <EmployeeDashboard employeeId={employeeId} />
      ) : (
        <p className="text-center p-4">Please provide an employeeId in the URL</p>
      )}
    </div>
  );
};

export default EmployeeDashboardPage;