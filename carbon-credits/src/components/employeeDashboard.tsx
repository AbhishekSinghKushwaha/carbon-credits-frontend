// "use clinet";
// import React, { useEffect, useState, useRef } from 'react';
// import { apiCall } from '../utils/api';
// import { useRouter } from 'next/navigation';

// interface Employee {
//   _id: string;
//   name: string;
//   userName: string;
//   employerUserName: string;
//   credits: number;
//   homeLocation: string;
//   workLocation: string;
//   distance: number;
//   travelTime: number;
// }

// const EmployeeDashboard: React.FC<{ employeeId: string }> = ({ employeeId }) => {
//   const [employee, setEmployee] = useState<Employee | null>(null);
//   const [loading, setLoading] = useState(true);
//   const [message, setMessage] = useState('');
//   const [calculatedDistance, setCalculatedDistance] = useState<string | null>(null);
//   const [calculatedTravelTime, setCalculatedTravelTime] = useState<string | null>(null);
//   const [fromLocation, setFromLocation] = useState<string>('');
//   const [toLocation, setToLocation] = useState<string>('');
//   const [transportMode, setTransportMode] = useState<string>('Public Transport'); // State for transportation mode

//   const fromInputRef = useRef<HTMLInputElement>(null);
//   const toInputRef = useRef<HTMLInputElement>(null);
//   const router = useRouter();

//   // Fetch employee data
//   useEffect(() => {
//     const fetchEmployee = async () => {
//       const response = await apiCall<Employee>(`/api/employees/get/${employeeId}`);
//       if (response.data) {
//         setEmployee(response.data);
//         setFromLocation(response.data.homeLocation);
//         setToLocation(response.data.workLocation);
//         if (response.data.distance) {
//           setCalculatedDistance(`${response.data.distance} mi`);
//         }
//         if (response.data.travelTime) {
//           setCalculatedTravelTime(`${response.data.travelTime} min`);
//         }
//       } else {
//         setMessage(response.error || 'Failed to fetch employee data');
//       }
//       setLoading(false);
//     };
//     fetchEmployee();
//   }, [employeeId]);

//   // Initialize Google Maps Autocomplete
//   useEffect(() => {
//     if (!window.google || !fromInputRef.current || !toInputRef.current) return;

//     const fromAutocomplete = new google.maps.places.Autocomplete(fromInputRef.current, {
//       types: ['geocode'],
//       componentRestrictions: { country: 'us' },
//     });

//     const toAutocomplete = new google.maps.places.Autocomplete(toInputRef.current, {
//       types: ['geocode'],
//       componentRestrictions: { country: 'us' },
//     });

//     fromAutocomplete.addListener('place_changed', () => {
//       const place = fromAutocomplete.getPlace();
//       if (place.formatted_address) {
//         setFromLocation(place.formatted_address);
//       }
//     });

//     toAutocomplete.addListener('place_changed', () => {
//       const place = toAutocomplete.getPlace();
//       if (place.formatted_address) {
//         setToLocation(place.formatted_address);
//       }
//     });
//   }, []);

//   // Helper function to update employee data
//   const updateEmployeeData = async (distanceValue: number, travelTimeValue: number) => {
//     try {
//       const updateResponse = await apiCall<{ message: string }>(
//         `/api/employees/${employeeId}`,
//         'PUT',
//         {
//           homeLocation: fromLocation,
//           workLocation: toLocation,
//           distance: distanceValue,
//           travelTime: travelTimeValue,
//         }
//       );

//       if (updateResponse.data) {
//         setMessage('Locations, distance, and travel time updated successfully');
//         setEmployee((prev) =>
//           prev
//             ? {
//                 ...prev,
//                 homeLocation: fromLocation,
//                 workLocation: toLocation,
//                 distance: distanceValue,
//                 travelTime: travelTimeValue,
//               }
//             : prev
//         );
//       } else {
//         setMessage('Failed to update locations: ' + updateResponse.error);
//       }
//     } catch (error) {
//       setMessage('Failed to update employee data');
//     }
//   };

//   // Calculate distance and travel time when locations change
//   useEffect(() => {
//     if (!window.google || !fromLocation || !toLocation) return;

//     const distanceMatrixService = new google.maps.DistanceMatrixService();

//     const calculateDistance = () => {
//       distanceMatrixService.getDistanceMatrix(
//         {
//           origins: [fromLocation],
//           destinations: [toLocation],
//           travelMode: google.maps.TravelMode.DRIVING,
//           unitSystem: google.maps.UnitSystem.IMPERIAL,
//         },
//         (response: google.maps.DistanceMatrixResponse | null, status: google.maps.DistanceMatrixStatus) => {
//           if (status === 'OK' && response?.rows[0]?.elements[0]?.status === 'OK') {
//             const distanceText = response.rows[0].elements[0].distance.text;
//             const distanceValue = response.rows[0].elements[0].distance.value / 1609.34; // Convert meters to miles
//             const travelTimeText = response.rows[0].elements[0].duration.text;
//             const travelTimeValue = Math.round(response.rows[0].elements[0].duration.value / 60); // Convert seconds to minutes
//             setCalculatedDistance(distanceText);
//             setCalculatedTravelTime(travelTimeText);

//             // Update employee data with the calculated distance and travel time
//             updateEmployeeData(distanceValue, travelTimeValue);
//           } else {
//             setCalculatedDistance('Unable to calculate distance');
//             setCalculatedTravelTime('Unable to calculate travel time');
//             setMessage('Failed to calculate distance and travel time');
//           }
//         }
//       );
//     };

//     calculateDistance();
//   }, [fromLocation, toLocation, employeeId]);

//   // Handle submission of transportation mode to track carbon credits
//   const handleTrackCredits = async () => {
//     const response = await apiCall<{ message: string; employee: Employee }>(
//       `/api/employees/${employeeId}/track-credits`,
//       'POST',
//       { mode: transportMode }
//     );
//     if (response.data) {
//       setMessage(response.data.message);
//       setEmployee(response.data.employee);
//       setTimeout(() => setMessage(''), 3000);
//     } else {
//       setMessage(response.error || 'Failed to track credits');
//     }
//   };

//   if (loading) return <p className="text-center">Loading...</p>;
//   if (!employee) return <p className="text-center text-red-500">{message}</p>;

//   return (
//     <div className="container mx-auto p-4">
//       <h2 className="text-2xl font-bold mb-4">Employee Dashboard</h2>
//       <p><strong>Name:</strong> {employee.name}</p>
//       <p><strong>Username:</strong> {employee.userName}</p>
//       <p><strong>Employer:</strong> {employee.employerUserName}</p>
//       <p><strong>Credits:</strong> {employee.credits}</p>

//       <div className="mt-4">
//         <label className="block mb-1">
//           <strong>From (Home Location):</strong>
//         </label>
//         <input
//           ref={fromInputRef}
//           type="text"
//           value={fromLocation}
//           onChange={(e) => setFromLocation(e.target.value)}
//           placeholder="Enter home location"
//           className="border p-2 mb-2 w-full"
//         />

//         <label className="block mb-1">
//           <strong>To (Work Location):</strong>
//         </label>
//         <input
//           ref={toInputRef}
//           type="text"
//           value={toLocation}
//           onChange={(e) => setToLocation(e.target.value)}
//           placeholder="Enter work location"
//           className="border p-2 mb-2 w-full"
//         />

//         <p><strong>Distance:</strong> {calculatedDistance || 'Calculating...'}</p>
//         <p><strong>Travel Time:</strong> {calculatedTravelTime || 'Calculating...'}</p>
//       </div>

//       <div className="mt-4">
//         <h3 className="text-xl font-semibold mb-2">Track Carbon Credits</h3>
//         <div className="flex items-center space-x-2">
//           <select
//             value={transportMode}
//             onChange={(e) => setTransportMode(e.target.value)}
//             className="border p-2"
//           >
//             <option value="Public Transport">Public Transport</option>
//             <option value="Bicycle">Bicycle</option>
//             <option value="Walking">Walking</option>
//             <option value="Carpool">Carpool</option>
//             <option value="Electric Vehicle">Electric Vehicle</option>
//             <option value="Car">Car</option>
//           </select>
//           <button
//             onClick={handleTrackCredits}
//             className="bg-blue-500 text-white p-2 rounded"
//           >
//             Submit
//           </button>
//         </div>
//       </div>

//       {message && <p className="mt-2 text-green-600">{message}</p>}
//     </div>
//   );
// };

// export default EmployeeDashboard;

// "use client";
// import React, { useEffect, useState, useRef } from 'react';
// import { apiCall } from '../utils/api';
// import { useRouter } from 'next/navigation';

// interface Employee {
//   _id: string;
//   name: string;
//   userName: string;
//   employerUserName: string;
//   credits: number;
//   homeLocation: string;
//   workLocation: string;
//   distance: number;
//   travelTime: number;
// }

// const EmployeeDashboard: React.FC<{ employeeId: string }> = ({ employeeId }) => {
//   const [employee, setEmployee] = useState<Employee | null>(null);
//   const [loading, setLoading] = useState(true);
//   const [message, setMessage] = useState('');
//   const [calculatedDistance, setCalculatedDistance] = useState<string | null>(null);
//   const [calculatedTravelTime, setCalculatedTravelTime] = useState<string | null>(null);
//   const [fromLocation, setFromLocation] = useState<string>('');
//   const [toLocation, setToLocation] = useState<string>('');
//   const [transportMode, setTransportMode] = useState<string>('Public Transport');
//   const mapRef = useRef<HTMLDivElement>(null);

//   const fromInputRef = useRef<HTMLInputElement>(null);
//   const toInputRef = useRef<HTMLInputElement>(null);
//   const router = useRouter();

//   // Fetch employee data
//   useEffect(() => {
//     const fetchEmployee = async () => {
//       const response = await apiCall<Employee>(`/api/employees/get/${employeeId}`);
//       if (response.data) {
//         setEmployee(response.data);
//         setFromLocation(response.data.homeLocation);
//         setToLocation(response.data.workLocation);
//         if (response.data.distance) {
//           setCalculatedDistance(`${response.data.distance} mi`);
//         }
//         if (response.data.travelTime) {
//           setCalculatedTravelTime(`${response.data.travelTime} min`);
//         }
//       } else {
//         setMessage(response.error || 'Failed to fetch employee data');
//       }
//       setLoading(false);
//     };
//     fetchEmployee();
//   }, [employeeId]);

//   // Initialize Google Maps Autocomplete and Map
//   useEffect(() => {
//     if (!window.google || !fromInputRef.current || !toInputRef.current || !mapRef.current) return;

//     // Initialize Autocomplete for search bars
//     const fromAutocomplete = new google.maps.places.Autocomplete(fromInputRef.current, {
//       types: ['geocode'],
//       componentRestrictions: { country: 'us' },
//     });

//     const toAutocomplete = new google.maps.places.Autocomplete(toInputRef.current, {
//       types: ['geocode'],
//       componentRestrictions: { country: 'us' },
//     });

//     fromAutocomplete.addListener('place_changed', () => {
//       const place = fromAutocomplete.getPlace();
//       if (place.formatted_address) {
//         setFromLocation(place.formatted_address);
//       }
//     });

//     toAutocomplete.addListener('place_changed', () => {
//       const place = toAutocomplete.getPlace();
//       if (place.formatted_address) {
//         setToLocation(place.formatted_address);
//       }
//     });

//     // Initialize the map with Boca Raton, Florida as the default center
//     const map = new google.maps.Map(mapRef.current, {
//       center: { lat: 26.3683, lng: -80.1289 }, // Boca Raton, Florida
//       zoom: 8,
//     });

//     const directionsService = new google.maps.DirectionsService();
//     const directionsRenderer = new google.maps.DirectionsRenderer();
//     directionsRenderer.setMap(map);

//     // Function to update the route on the map
//     const updateRoute = () => {
//       if (!fromLocation || !toLocation) return;

//       directionsService.route(
//         {
//           origin: fromLocation,
//           destination: toLocation,
//           travelMode: google.maps.TravelMode.DRIVING,
//         },
//         (result: google.maps.DirectionsResult | null, status: google.maps.DirectionsStatus) => {
//           if (status === 'OK' && result) {
//             directionsRenderer.setDirections(result);
//           } else {
//             setMessage('Failed to display route on map');
//           }
//         }
//       );
//     };

//     // Update route whenever locations change
//     updateRoute();
//   }, [fromLocation, toLocation]);

//   // Helper function to update employee data
//   const updateEmployeeData = async (distanceValue: number, travelTimeValue: number) => {
//     try {
//       const updateResponse = await apiCall<{ message: string }>(
//         `/api/employees/${employeeId}`,
//         'PUT',
//         {
//           homeLocation: fromLocation,
//           workLocation: toLocation,
//           distance: distanceValue,
//           travelTime: travelTimeValue,
//         }
//       );

//       if (updateResponse.data) {
//         setMessage('Locations, distance, and travel time updated successfully');
//         setEmployee((prev) =>
//           prev
//             ? {
//                 ...prev,
//                 homeLocation: fromLocation,
//                 workLocation: toLocation,
//                 distance: distanceValue,
//                 travelTime: travelTimeValue,
//               }
//             : prev
//         );
//       } else {
//         setMessage('Failed to update locations: ' + updateResponse.error);
//       }
//     } catch (error) {
//       setMessage('Failed to update employee data');
//     }
//   };

//   // Calculate distance and travel time when locations change
//   useEffect(() => {
//     if (!window.google || !fromLocation || !toLocation) return;

//     const distanceMatrixService = new google.maps.DistanceMatrixService();

//     const calculateDistance = () => {
//       distanceMatrixService.getDistanceMatrix(
//         {
//           origins: [fromLocation],
//           destinations: [toLocation],
//           travelMode: google.maps.TravelMode.DRIVING,
//           unitSystem: google.maps.UnitSystem.IMPERIAL,
//         },
//         (response: google.maps.DistanceMatrixResponse | null, status: google.maps.DistanceMatrixStatus) => {
//           if (status === 'OK' && response?.rows[0]?.elements[0]?.status === 'OK') {
//             const distanceText = response.rows[0].elements[0].distance.text;
//             const distanceValue = response.rows[0].elements[0].distance.value / 1609.34; // Convert meters to miles
//             const travelTimeText = response.rows[0].elements[0].duration.text;
//             const travelTimeValue = Math.round(response.rows[0].elements[0].duration.value / 60); // Convert seconds to minutes
//             setCalculatedDistance(distanceText);
//             setCalculatedTravelTime(travelTimeText);

//             // Update employee data with the calculated distance and travel time
//             updateEmployeeData(distanceValue, travelTimeValue);
//           } else {
//             setCalculatedDistance('Unable to calculate distance');
//             setCalculatedTravelTime('Unable to calculate travel time');
//             setMessage('Failed to calculate distance and travel time');
//           }
//         }
//       );
//     };

//     calculateDistance();
//   }, [fromLocation, toLocation, employeeId]);

//   // Handle submission of transportation mode to track carbon credits
//   const handleTrackCredits = async () => {
//     const response = await apiCall<{ message: string; employee: Employee }>(
//       `/api/employees/${employeeId}/track-credits`,
//       'POST',
//       { mode: transportMode }
//     );
//     if (response.data) {
//       setMessage(response.data.message);
//       setEmployee(response.data.employee);
//       // setTimeout(() => setMessage(''), 7000);
//     } else {
//       setMessage(response.error || 'Failed to track credits');
//     }
//   };

//   if (loading) return <p className="text-center">Loading...</p>;
//   if (!employee) return <p className="text-center text-red-500">{message}</p>;

//   return (
//     <div className="container mx-auto p-4">
//       <h2 className="text-2xl font-bold mb-4">Employee Dashboard</h2>
//       <p><strong>Name:</strong> {employee.name}</p>
//       <p><strong>Username:</strong> {employee.userName}</p>
//       <p><strong>Employer:</strong> {employee.employerUserName}</p>
//       <p><strong>Credits:</strong> {employee.credits}</p>

//       <div className="mt-4">
//         <label className="block mb-1">
//           <strong>From (Home Location):</strong>
//         </label>
//         <input
//           ref={fromInputRef}
//           type="text"
//           value={fromLocation}
//           onChange={(e) => setFromLocation(e.target.value)}
//           placeholder="Enter home location"
//           className="border p-2 mb-2 w-full"
//         />

//         <label className="block mb-1">
//           <strong>To (Work Location):</strong>
//         </label>
//         <input
//           ref={toInputRef}
//           type="text"
//           value={toLocation}
//           onChange={(e) => setToLocation(e.target.value)}
//           placeholder="Enter work location"
//           className="border p-2 mb-2 w-full"
//         />

//         <p><strong>Distance:</strong> {calculatedDistance || 'Calculating...'}</p>
//         <p><strong>Travel Time:</strong> {calculatedTravelTime || 'Calculating...'}</p>

//         {/* Map to display the route */}
//         <div className="mt-4">
//           <h3 className="text-xl font-semibold mb-2">Route</h3>
//           <div ref={mapRef} className="w-full h-96"></div>
//         </div>
//       </div>

//       <div className="mt-4">
//         <h3 className="text-xl font-semibold mb-2">Track Carbon Credits</h3>
//         <div className="flex items-center space-x-2">
//           <select
//             value={transportMode}
//             onChange={(e) => setTransportMode(e.target.value)}
//             className="border p-2"
//           >
//             <option value="Public Transport">Public Transport</option>
//             <option value="Bicycle">Bicycle</option>
//             <option value="Walking">Walking</option>
//             <option value="Carpool">Carpool</option>
//             <option value="Electric Vehicle">Electric Vehicle</option>
//             <option value="Car">Car</option>
//           </select>
//           <button
//             onClick={handleTrackCredits}
//             className="bg-blue-500 text-white p-2 rounded"
//           >
//             Submit
//           </button>
//         </div>
//       </div>

//       {message && <p className="mt-2 text-green-600">{message}</p>}
//     </div>
//   );
// };

// export default EmployeeDashboard;

"use client";
import React, { useEffect, useState, useRef } from 'react';
import { apiCall } from '../utils/api';
import { useRouter } from 'next/navigation';

interface Employee {
  _id: string;
  name: string;
  userName: string;
  employerUserName: string;
  credits: number;
  homeLocation: string;
  workLocation: string;
  distance: number;
  travelTime: number;
}

const EmployeeDashboard: React.FC<{ employeeId: string }> = ({ employeeId }) => {
  const [employee, setEmployee] = useState<Employee | null>(null);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');
  const [calculatedDistance, setCalculatedDistance] = useState<string | null>(null);
  const [calculatedTravelTime, setCalculatedTravelTime] = useState<string | null>(null);
  const [fromLocation, setFromLocation] = useState<string>('');
  const [toLocation, setToLocation] = useState<string>('');
  const [transportMode, setTransportMode] = useState<string>('Public Transport');
  const mapRef = useRef<HTMLDivElement>(null);
  const fromInputRef = useRef<HTMLInputElement>(null);
  const toInputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  useEffect(() => {
    const fetchEmployee = async () => {
      const response = await apiCall<Employee>(`/api/employees/get/${employeeId}`);
      if (response.data) {
        setEmployee(response.data);
        setFromLocation(response.data.homeLocation);
        setToLocation(response.data.workLocation);
        if (response.data.distance) {
          setCalculatedDistance(`${response.data.distance} mi`);
        }
        if (response.data.travelTime) {
          setCalculatedTravelTime(`${response.data.travelTime} min`);
        }
      } else {
        setMessage(response.error || 'Failed to fetch employee data');
      }
      setLoading(false);
    };
    fetchEmployee();
  }, [employeeId]);

  useEffect(() => {
    if (!window.google || !fromInputRef.current || !toInputRef.current || !mapRef.current) return;

    const fromAutocomplete = new google.maps.places.Autocomplete(fromInputRef.current, {
      types: ['geocode'],
      componentRestrictions: { country: 'us' },
    });

    const toAutocomplete = new google.maps.places.Autocomplete(toInputRef.current, {
      types: ['geocode'],
      componentRestrictions: { country: 'us' },
    });

    fromAutocomplete.addListener('place_changed', () => {
      const place = fromAutocomplete.getPlace();
      if (place.formatted_address) {
        setFromLocation(place.formatted_address);
      }
    });

    toAutocomplete.addListener('place_changed', () => {
      const place = toAutocomplete.getPlace();
      if (place.formatted_address) {
        setToLocation(place.formatted_address);
      }
    });

    const map = new google.maps.Map(mapRef.current, {
      center: { lat: 26.3683, lng: -80.1289 },
      zoom: 8,
    });

    const directionsService = new google.maps.DirectionsService();
    const directionsRenderer = new google.maps.DirectionsRenderer();
    directionsRenderer.setMap(map);

    const updateRoute = () => {
      if (!fromLocation || !toLocation) return;

      directionsService.route(
        {
          origin: fromLocation,
          destination: toLocation,
          travelMode: google.maps.TravelMode.DRIVING,
        },
        (result: google.maps.DirectionsResult | null, status: google.maps.DirectionsStatus) => {
          if (status === 'OK' && result) {
            directionsRenderer.setDirections(result);
          } else {
            setMessage('Failed to display route on map');
          }
        }
      );
    };

    updateRoute();
  }, [fromLocation, toLocation]);

  const updateEmployeeData = async (distanceValue: number, travelTimeValue: number) => {
    try {
      const updateResponse = await apiCall<{ message: string }>(
        `/api/employees/${employeeId}`,
        'PUT',
        {
          homeLocation: fromLocation,
          workLocation: toLocation,
          distance: distanceValue,
          travelTime: travelTimeValue,
        }
      );

      if (updateResponse.data) {
        setMessage('Locations, distance, and travel time updated successfully');
        setEmployee((prev) =>
          prev
            ? {
                ...prev,
                homeLocation: fromLocation,
                workLocation: toLocation,
                distance: distanceValue,
                travelTime: travelTimeValue,
              }
            : prev
        );
      } else {
        setMessage('Failed to update locations: ' + updateResponse.error);
      }
    } catch (error) {
      setMessage('Failed to update employee data');
    }
  };

  useEffect(() => {
    if (!window.google || !fromLocation || !toLocation) return;

    const distanceMatrixService = new google.maps.DistanceMatrixService();

    const calculateDistance = () => {
      distanceMatrixService.getDistanceMatrix(
        {
          origins: [fromLocation],
          destinations: [toLocation],
          travelMode: google.maps.TravelMode.DRIVING,
          unitSystem: google.maps.UnitSystem.IMPERIAL,
        },
        (response: google.maps.DistanceMatrixResponse | null, status: google.maps.DistanceMatrixStatus) => {
          if (status === 'OK' && response?.rows[0]?.elements[0]?.status === 'OK') {
            const distanceText = response.rows[0].elements[0].distance.text;
            const distanceValue = response.rows[0].elements[0].distance.value / 1609.34;
            const travelTimeText = response.rows[0].elements[0].duration.text;
            const travelTimeValue = Math.round(response.rows[0].elements[0].duration.value / 60);
            setCalculatedDistance(distanceText);
            setCalculatedTravelTime(travelTimeText);

            updateEmployeeData(distanceValue, travelTimeValue);
          } else {
            setCalculatedDistance('Unable to calculate distance');
            setCalculatedTravelTime('Unable to calculate travel time');
            setMessage('Failed to calculate distance and travel time');
          }
        }
      );
    };

    calculateDistance();
  }, [fromLocation, toLocation, employeeId]);

  const handleTrackCredits = async () => {
    const response = await apiCall<{ message: string; employee: Employee }>(
      `/api/employees/${employeeId}/track-credits`,
      'POST',
      { mode: transportMode }
    );
    if (response.data) {
      setMessage(response.data.message);
      setEmployee(response.data.employee);
      setTimeout(() => setMessage(''), 5000);
    } else {
      setMessage(response.error || 'Failed to track credits');
    }
  };

  if (loading) return <p className="text-center">Loading...</p>;
  if (!employee) return <p className="text-center text-red-500">{message}</p>;

  return (
    <div className="container mx-auto p-4">
      <h2 className="text-2xl font-bold mb-4">Employee Dashboard</h2>
      <p><strong>Name:</strong> {employee.name}</p>
      <p><strong>Username:</strong> {employee.userName}</p>
      <p><strong>Employer:</strong> {employee.employerUserName}</p>
      <p><strong>Credits:</strong> {employee.credits.toFixed(2)}</p>

      <div className="mt-4">
        <label className="block mb-1">
          <strong>From (Home Location):</strong>
        </label>
        <input
          ref={fromInputRef}
          type="text"
          value={fromLocation}
          onChange={(e) => setFromLocation(e.target.value)}
          placeholder="Enter home location"
          className="border p-2 mb-2 w-full"
        />

        <label className="block mb-1">
          <strong>To (Work Location):</strong>
        </label>
        <input
          ref={toInputRef}
          type="text"
          value={toLocation}
          onChange={(e) => setToLocation(e.target.value)}
          placeholder="Enter work location"
          className="border p-2 mb-2 w-full"
        />

        <p><strong>Distance:</strong> {calculatedDistance || 'Calculating...'}</p>
        <p><strong>Travel Time:</strong> {calculatedTravelTime || 'Calculating...'}</p>

        <div className="mt-4">
          <h3 className="text-xl font-semibold mb-2">Route</h3>
          <div ref={mapRef} className="w-full h-96"></div>
        </div>
      </div>

      <div className="mt-4">
        <h3 className="text-xl font-semibold mb-2">Track Carbon Credits</h3>
        <p className="text-sm text-gray-600 mb-2">You can track credits once per day.</p>
        <div className="flex items-center space-x-2">
          <select
            value={transportMode}
            onChange={(e) => setTransportMode(e.target.value)}
            className="border p-2"
          >
            <option value="Public Transport">Public Transport</option>
            <option value="Bicycle">Bicycle</option>
            <option value="Walking">Walking</option>
            <option value="Carpool">Carpool</option>
            <option value="Electric Vehicle">Electric Vehicle</option>
            <option value="Car">Car</option>
          </select>
          <button
            onClick={handleTrackCredits}
            className="bg-blue-500 text-white p-2 rounded"
          >
            Submit
          </button>
        </div>
      </div>

      {message && (
        <p className={`mt-2 ${message.includes('deducted') ? 'text-green-600' : 'text-red-500'}`}>
          {message}
        </p>
      )}
    </div>
  );
};

export default EmployeeDashboard;