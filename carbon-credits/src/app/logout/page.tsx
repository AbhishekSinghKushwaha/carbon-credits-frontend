"use client";
import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../utils/authContext';

const Logout: React.FC = () => {
  const router = useRouter();
  const { logout } = useAuth();

  useEffect(() => {
    logout();
    router.push('/');
  }, [logout, router]);

  return (
    <div className="container mx-auto p-4 text-center">
      <h1 className="text-2xl font-bold mb-4">Logging Out...</h1>
      <p>You are being redirected to the homepage.</p>
    </div>
  );
};

export default Logout;