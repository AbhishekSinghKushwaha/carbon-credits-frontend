"use client";
import React, { useEffect, useState } from 'react';
import Navbar from '../../../components/navbar';
import EmployeeDashboard from '../../../components/employeeDashboard';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '../../../utils/authContext';
import Script from 'next/script';

const EmployeeDashboardPage: React.FC = () => {
  const router = useRouter();
  const { user, loading } = useAuth();
  const searchParams = useSearchParams();
  const employeeId = searchParams.get('employeeId');
  const [scriptLoaded, setScriptLoaded] = useState(false);

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
        <>
          <Script
            src={`https://maps.googleapis.com/maps/api/js?key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}&libraries=places`}
            strategy="afterInteractive"
            onLoad={() => setScriptLoaded(true)}
            onError={(e) => console.error('Google Maps script failed to load:', e)}
          />
          {scriptLoaded ? (
            <EmployeeDashboard employeeId={employeeId} />
          ) : (
            <p className="text-center p-4">Loading Google Maps...</p>
          )}
        </>
      ) : (
        <p className="text-center p-4">Please provide an employeeId in the URL</p>
      )}
    </div>
  );
};

export default EmployeeDashboardPage;