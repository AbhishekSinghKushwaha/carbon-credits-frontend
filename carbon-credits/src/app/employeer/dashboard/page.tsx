"use client";
import React from 'react';
import Navbar from '../../../components/navbar';
import EmployerDashboard from '../../../components/employerDashboard';
import { useSearchParams } from 'next/navigation'


const EmployerDashboardPage: React.FC = () => {
  const searchParams = useSearchParams()
  const employerId = searchParams.get('employerId')


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

export default EmployerDashboardPage;