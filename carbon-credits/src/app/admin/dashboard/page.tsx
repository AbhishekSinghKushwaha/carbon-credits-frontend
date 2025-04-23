"use client";
import React, { useEffect, Suspense } from 'react';
import Navbar from '../../../components/navbar';
import AdminDashboard from '../../../components/adminDashboard';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '../../../utils/authContext';

const AdminDashboardPage: React.FC = () => {
  const router = useRouter();
  const { user, loading } = useAuth();
  const searchParams = useSearchParams();
  const adminUserName = searchParams.get('adminUserName');

  useEffect(() => {
    if (!loading && (!user || user.role !== 'admin')) {
      router.push('/admin/login');
    }
  }, [user, loading, router]);

  if (loading) {
    return <p className="text-center p-4">Loading authentication...</p>;
  }

  if (!user || user.role !== 'admin') {
    return <p className="text-center p-4">Redirecting to login...</p>;
  }

  return (
    <div>
      <Navbar />
      {adminUserName ? (
        <AdminDashboard adminUserName={adminUserName} />
      ) : (
        <p className="text-center p-4">Please provide an adminUserName in the URL</p>
      )}
    </div>
  );
};

export default function AdminDashboardContent() {
  return (
    <Suspense fallback={<div>Loading admin dashboard...</div>}>
      <AdminDashboardPage />
    </Suspense>
  );
};