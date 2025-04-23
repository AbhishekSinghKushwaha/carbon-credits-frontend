// import React, { useEffect, useState } from 'react';
// import { apiCall } from '../utils/api';

// interface Employer {
//   _id: string;
//   name: string;
//   userName: string;
//   credits: number;
//   bankApproved: boolean;
// }

// interface Employee {
//   _id: string;
//   name: string;
//   credits: number;
// }

// const EmployerDashboard: React.FC<{ employerId: string }> = ({ employerId }) => {
//   const [employer, setEmployer] = useState<Employer | null>(null);
//   const [employees, setEmployees] = useState<Employee[]>([]);
//   const [tradePartnerId, setTradePartnerId] = useState('');
//   const [tradeCredits, setTradeCredits] = useState(0);
//   const [loading, setLoading] = useState(true);
//   const [allEmployers, setAllEmployers] = useState<Employer[]>([]); // State for all employers

//   // Fetch employer and employees
//   useEffect(() => {
//     const fetchEmployer = async () => {
//       const response = await apiCall<{ employer: Employer; employees: Employee[] }>(
//         `/api/employers/get/${employerId}`
//       );
//       if (response.data) {
//         setEmployer(response.data.employer);
//         setEmployees(response.data.employees);
//       }
//       setLoading(false);
//     };
//     fetchEmployer();
//   }, [employerId]);

//   // Fetch all employers for the trade partner dropdown
//   useEffect(() => {
//     const fetchAllEmployers = async () => {
//       const response = await apiCall<Employer[]>('/api/employers');
//       if (response.data) {
//         // Filter out the current employer
//         const filteredEmployers = response.data.filter((emp) => emp._id !== employerId);
//         setAllEmployers(filteredEmployers);
//         // Set default trade partner to the first employer in the list (if available)
//         if (filteredEmployers.length > 0) {
//           setTradePartnerId(filteredEmployers[0].userName);
//         }
//       }
//     };
//     fetchAllEmployers();
//   }, [employerId]);

//   const handleTrade = async () => {
//     if (!employer) return;

//     const response = await apiCall<{ message: string }>(
//       '/api/employers/trade',
//       'POST',
//       { sellerUserName: employer.userName, buyerUserName: tradePartnerId, credits: tradeCredits }
//     );
//     if (response.data) {
//       alert(response.data.message);
//       window.location.reload(); // Refresh to update credits
//     } else {
//       alert(response.error);
//     }
//   };

//   if (loading) return <p className="text-center">Loading...</p>;

//   return (
//     <div className="container mx-auto p-4">
//       <h2 className="text-2xl font-bold mb-4">Employer Dashboard</h2>
//       {employer ? (
//         <>
//           <p>Name: {employer.name}</p>
//           <p>Credits: {employer.credits}</p>
//           <p>Bank Approved: {employer.bankApproved ? 'Yes' : 'No'}</p>
//           <h3 className="text-xl mt-4">Employees</h3>
//           <ul>
//             {employees.map((emp) => (
//               <li key={emp._id}>
//                 {emp.name} - Credits: {emp.credits}
//               </li>
//             ))}
//           </ul>
//           <h3 className="text-xl mt-4">Trade Credits</h3>
//           <select
//             value={tradePartnerId}
//             onChange={(e) => setTradePartnerId(e.target.value)}
//             className="border p-2 mr-2"
//             disabled={allEmployers.length === 0}
//           >
//             {allEmployers.length === 0 ? (
//               <option value="">No other employers available</option>
//             ) : (
//               allEmployers.map((emp) => (
//                 <option key={emp._id} value={emp.userName}>
//                   {emp.userName} ({emp.name})
//                 </option>
//               ))
//             )}
//           </select>
//           <input
//             type="number"
//             value={tradeCredits}
//             onChange={(e) => setTradeCredits(Number(e.target.value))}
//             placeholder="Credits to Trade"
//             className="border p-2 mr-2"
//           />
//           <button onClick={handleTrade} className="bg-blue-500 text-white p-2">
//             Trade
//           </button>
//         </>
//       ) : (
//         <p>Employer not found</p>
//       )}
//     </div>
//   );
// };

// export default EmployerDashboard;

"use client";
import React, { useEffect, useState } from 'react';
import { apiCall } from '../utils/api';

interface Employer {
  _id: string;
  name: string;
  userName: string;
  credits: number;
  bankApproved: boolean;
}

interface Employee {
  _id: string;
  name: string;
  credits: number;
}

const EmployerDashboard: React.FC<{ employerId: string }> = ({ employerId }) => {
  const [employer, setEmployer] = useState<Employer | null>(null);
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [tradePartnerId, setTradePartnerId] = useState('');
  const [tradeCredits, setTradeCredits] = useState(0);
  const [buyCredits, setBuyCredits] = useState(0); // State for buying credits
  const [loading, setLoading] = useState(true);
  const [allEmployers, setAllEmployers] = useState<Employer[]>([]);

  useEffect(() => {
    const fetchEmployer = async () => {
      const response = await apiCall<{ employer: Employer; employees: Employee[] }>(
        `/api/employers/get/${employerId}`
      );
      if (response.data) {
        setEmployer(response.data.employer);
        setEmployees(response.data.employees);
      }
      setLoading(false);
    };
    fetchEmployer();
  }, [employerId]);

  useEffect(() => {
    const fetchAllEmployers = async () => {
      const response = await apiCall<Employer[]>('/api/employers');
      if (response.data) {
        const filteredEmployers = response.data.filter((emp) => emp._id !== employerId);
        setAllEmployers(filteredEmployers);
        if (filteredEmployers.length > 0) {
          setTradePartnerId(filteredEmployers[0].userName);
        }
      }
    };
    fetchAllEmployers();
  }, [employerId]);

  const handleTrade = async () => {
    if (!employer) return;
    if (tradeCredits <= 0) {
      alert('Please enter a valid number of credits to trade.');
      return;
    }
    if (tradeCredits > employer.credits) {
      alert('You do not have enough credits to trade.');
      return;
    }

    const response = await apiCall<{ message: string }>(
      '/api/employers/trade',
      'POST',
      { sellerUserName: employer.userName, buyerUserName: tradePartnerId, credits: tradeCredits }
    );
    if (response.data) {
      alert(response.data.message);
      window.location.reload();
    } else {
      alert(response.error);
    }
  };

  const handleBuyCredits = async () => {
    if (!employer) return;
    if (buyCredits <= 0) {
      alert('Please enter a valid number of credits to buy.');
      return;
    }

    const response = await apiCall<{ message: string }>(
      '/api/employers/buy',
      'POST',
      { userName: employer.userName, credits: buyCredits }
    );
    if (response.data) {
      alert(response.data.message);
      window.location.reload();
    } else {
      alert(response.error);
    }
  };

  if (loading) return <p className="text-center">Loading...</p>;

  return (
    <div className="container mx-auto p-4">
      <h2 className="text-2xl font-bold mb-4">Employer Dashboard</h2>
      {employer ? (
        <>
          <p>Name: {employer.name}</p>
          <p>Credits: {employer.credits}</p>
          <p>Bank Approved: {employer.bankApproved ? 'Yes' : 'No'}</p>
          <h3 className="text-xl mt-4">Employees</h3>
          <ul>
            {employees.map((emp) => (
              <li key={emp._id}>
                {emp.name} - Credits: {emp.credits}
              </li>
            ))}
          </ul>
          <h3 className="text-xl mt-4">Trade Credits (Sell to Another Employer)</h3>
          <select
            value={tradePartnerId}
            onChange={(e) => setTradePartnerId(e.target.value)}
            className="border p-2 mr-2"
            disabled={allEmployers.length === 0}
          >
            {allEmployers.length === 0 ? (
              <option value="">No other employers available</option>
            ) : (
              allEmployers.map((emp) => (
                <option key={emp._id} value={emp.userName}>
                  {emp.userName} ({emp.name}) - Credits: {emp.credits}
                </option>
              ))
            )}
          </select>
          <input
            type="number"
            value={tradeCredits}
            onChange={(e) => setTradeCredits(Number(e.target.value))}
            placeholder="Credits to Trade"
            className="border p-2 mr-2"
          />
          <button onClick={handleTrade} className="bg-blue-500 text-white p-2">
            Trade
          </button>

          <h3 className="text-xl mt-4">Buy Credits (From Carbon Credit Bank)</h3>
          <input
            type="number"
            value={buyCredits}
            onChange={(e) => setBuyCredits(Number(e.target.value))}
            placeholder="Credits to Buy"
            className="border p-2 mr-2"
          />
          <button onClick={handleBuyCredits} className="bg-green-500 text-white p-2">
            Buy Credits
          </button>
        </>
      ) : (
        <p>Employer not found</p>
      )}
    </div>
  );
};

export default EmployerDashboard;