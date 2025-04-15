"use client";
// import React, { useState } from 'react';
// import Navbar from '../../../components/navbar';
// import { apiCall } from '../../../utils/api';
// import { useRouter } from 'next/navigation';

// const AdminLogin: React.FC = () => {
//   const [userName, setUserName] = useState('');
//   const [password, setPassword] = useState('');
//   const [message, setMessage] = useState('');
//   const router = useRouter();

//   const handleLogin = async () => {
//     const response = await apiCall<{ message: string; user: { userName: string } }>(
//       '/api/admin/login',
//       'POST',
//       { userName, password }
//     );
//     if (response.data) {
//       setMessage(response.data.message);
//       console.log(response.data)
//       router.push(`/admin/dashboard?adminUserName=${response.data?.user?.userName}`);
//     } else {
//       setMessage(response.error || 'Login failed');
//     }
//   };

//   return (
//     <div>
//       <Navbar />
//       <div className="container mx-auto p-4">
//         <h1 className="text-2xl font-bold mb-4">Admin Login</h1>
//         <input
//           type="text"
//           value={userName}
//           onChange={(e) => setUserName(e.target.value)}
//           placeholder="Username"
//           className="border p-2 mb-2 w-full"
//         />
//         <input
//           type="password"
//           value={password}
//           onChange={(e) => setPassword(e.target.value)}
//           placeholder="Password"
//           className="border p-2 mb-2 w-full"
//         />
//         <button onClick={handleLogin} className="bg-purple-500 text-white p-2">
//           Login
//         </button>
//         {message && <p className="mt-2 text-green-600">{message}</p>}
//       </div>
//     </div>
//   );
// };

// export default AdminLogin;

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';

const AdminLogin: React.FC = () => {
  const router = useRouter();

  useEffect(() => {
    router.push('/login?role=admin');
  }, [router]);

  return <p className="text-center p-4">Redirecting to login...</p>;
};

export default AdminLogin;