"use client";
import React, { useEffect, Suspense } from 'react';
import Navbar from '../../../components/navbar';
import EmployerDashboard from '../../../components/employerDashboard';
import { useSearchParams } from 'next/navigation'
import { useRouter } from 'next/navigation';
import { useAuth } from '../../../utils/authContext';

const EmployerDashboardPage: React.FC = () => {
  const searchParams = useSearchParams()
  const employerId = searchParams.get('employerId')
  const router = useRouter();
  const { user, loading } = useAuth();

  useEffect(() => {
    if (!loading && (!user || user.role !== 'employer')) {
      router.push('/login');
    }
  }, [user, loading, router]);

  if (loading) {
    return <p className="text-center p-4">Loading authentication...</p>;
  }

  if (!user || user.role !== 'employer') {
    return <p className="text-center p-4">Redirecting to login...</p>;
  }

  return (
    <div>
      <Navbar />
      {employerId ? (
        <EmployerDashboard employerId={employerId as string} />
      ) : (
        <p className="text-center p-4">Please provide an employerId in the URL</p>
      )}
    </div>
  );
};

export default function EmployerDashboardContent() {
  return (
      <Suspense fallback={<div>Loading admin dashboard...</div>}>
        <EmployerDashboardPage />
      </Suspense>
    );
};