import React, { useState } from 'react';
import { apiCall } from '../utils/api';

interface CreditTrackerProps {
  employeeId: string;
}

const CreditTracker: React.FC<CreditTrackerProps> = ({ employeeId }) => {
  const [travelMethod, setTravelMethod] = useState<'public' | 'carpool' | 'wfh'>('public');
  const [miles, setMiles] = useState<number>(0);
  const [message, setMessage] = useState<string>('');

  const submitTravel = async () => {
    const response = await apiCall<{ message: string }>(
      '/api/credits/submit',
      'POST',
      { employeeId, milesSaved: miles, method: travelMethod }
    );
    if (response.data) {
      setMessage(response.data.message);
      setMiles(0);
      setTimeout(() => setMessage(''), 3000); // Clear message after 3s
    } else {
      setMessage(response.error || 'Error submitting credit');
    }
  };

  return (
    <div className="p-4 mt-4 border-t">
      <h3 className="text-xl mb-2">Track Carbon Credits</h3>
      <select
        value={travelMethod}
        onChange={(e) => setTravelMethod(e.target.value as 'public' | 'carpool' | 'wfh')}
        className="border p-2"
      >
        <option value="public">Public Transport</option>
        <option value="carpool">Carpool</option>
        <option value="wfh">Work from Home</option>
      </select>
      <input
        type="number"
        value={miles}
        onChange={(e) => setMiles(Number(e.target.value))}
        placeholder="Miles saved"
        className="border p-2 ml-2"
      />
      <button onClick={submitTravel} className="bg-blue-500 text-white p-2 ml-2">
        Submit
      </button>
      {message && <p className="mt-2 text-green-600">{message}</p>}
    </div>
  );
};

export default CreditTracker;