"use client";
import React from 'react';
import Navbar from '../../../components/navbar';
import EmployeeDashboard from '../../../components/employeeDashboard';
// import { useRouter } from 'next/navigation';
import { useSearchParams } from 'next/navigation'


const EmployeeDashboardPage: React.FC = () => {
  // const router = useRouter();
  const searchParams = useSearchParams()
  const employeeId = searchParams.get('employeeId')

  // const { employeeId } = router.query;

  return (
    <div>
      <Navbar />
      {employeeId ? (
        <EmployeeDashboard employeeId={employeeId as string} />
      ) : (
        <p className="text-center p-4">Please provide an employeeId in the URL</p>
      )}
    </div>
  );
};

export default EmployeeDashboardPage;