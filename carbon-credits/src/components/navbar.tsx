import React from 'react';
import Link from 'next/link';

const Navbar: React.FC = () => {
  return (
    <nav className="bg-gray-800 p-4">
      <div className="container mx-auto flex justify-between items-center">
        <Link href="/" className="text-white text-lg font-bold">
          OWL Foot Print
        </Link>
        <div>
          <Link href="/login" className="text-white mr-4">
            Login
          </Link>
          <Link href="/" className="text-white">
            Logout
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;