// "use client";
// import React, { useState, useEffect } from 'react';
// import Navbar from '../../../components/navbar';
// import { apiCall } from '../../../utils/api';
// import { useRouter } from 'next/navigation';

// interface Employer {
//   userName: string;
//   name: string;
// }

// const EmployeeRegister: React.FC = () => {
//   const [name, setName] = useState('');
//   const [userName, setUserName] = useState('');
//   const [email, setEmail] = useState('');
//   const [password, setPassword] = useState('');
//   const [employerUserName, setEmployerUserName] = useState('');
//   const [homeLocation, setHomeLocation] = useState('');
//   const [workLocation, setWorkLocation] = useState('');
//   const [message, setMessage] = useState('');
//   const [employers, setEmployers] = useState<Employer[]>([]);
//   const router = useRouter();

//   useEffect(() => {
//     const fetchEmployers = async () => {
//       const response = await apiCall<Employer[]>('/api/employers');
//       if (response.data) {
//         setEmployers(response.data);
//         if (response.data.length > 0) {
//           setEmployerUserName(response.data[0].userName); // Default to first employer
//         }
//       }
//     };
//     fetchEmployers();
//   }, []);

//   const handleRegister = async () => {
//     const response = await apiCall<{ message: string; employee: { _id: string } }>(
//       '/api/employees/register',
//       'POST',
//       { name, userName, email, password, employerUserName, homeLocation, workLocation }
//     );
//     if (response.data) {
//       setMessage(response.data.message);
//       router.push(`/employee/dashboard?employeeId=${response.data.employee._id}`);
//     } else {
//       setMessage(response.error || 'Registration failed');
//     }
//   };

//   return (
//     <div>
//       <Navbar />
//       <div className="container mx-auto p-4">
//         <h1 className="text-2xl font-bold mb-4">Employee Registration</h1>
//         <input
//           type="text"
//           value={name}
//           onChange={(e) => setName(e.target.value)}
//           placeholder="Name"
//           className="border p-2 mb-2 w-full"
//         />
//         <input
//           type="text"
//           value={userName}
//           onChange={(e) => setUserName(e.target.value)}
//           placeholder="Username"
//           className="border p-2 mb-2 w-full"
//         />
//         <input
//           type="email"
//           value={email}
//           onChange={(e) => setEmail(e.target.value)}
//           placeholder="Email"
//           className="border p-2 mb-2 w-full"
//         />
//         <input
//           type="password"
//           value={password}
//           onChange={(e) => setPassword(e.target.value)}
//           placeholder="Password"
//           className="border p-2 mb-2 w-full"
//         />
//         <select
//           value={employerUserName}
//           onChange={(e) => setEmployerUserName(e.target.value)}
//           className="border p-2 mb-2 w-full"
//         >
//           {employers.map((employer) => (
//             <option key={employer.userName} value={employer.userName}>
//               {employer.name} ({employer.userName})
//             </option>
//           ))}
//         </select>
//         <input
//           type="text"
//           value={homeLocation}
//           onChange={(e) => setHomeLocation(e.target.value)}
//           placeholder="Home Location"
//           className="border p-2 mb-2 w-full"
//         />
//         <input
//           type="text"
//           value={workLocation}
//           onChange={(e) => setWorkLocation(e.target.value)}
//           placeholder="Work Location"
//           className="border p-2 mb-2 w-full"
//         />
//         <button onClick={handleRegister} className="bg-blue-500 text-white p-2">
//           Register
//         </button>
//         {message && <p className="mt-2 text-green-600">{message}</p>}
//       </div>
//     </div>
//   );
// };

// export default EmployeeRegister;

'use client';
import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Script from 'next/script';
import { apiCall } from '../../../utils/api';

// Define the type for formData
interface FormData {
  name: string;
  userName: string;
  email: string;
  password: string;
  employerUserName: string;
  homeLocation: string;
  workLocation: string;
  distance: number;
  travelTime: number;
}

// Define the type for Employer
interface Employer {
  _id: string;
  userName: string;
  name: string;
  email: string;
}

const EmployeeRegister: React.FC = () => {
  const [formData, setFormData] = useState<FormData>({
    name: '',
    userName: '',
    email: '',
    password: '',
    employerUserName: '',
    homeLocation: '',
    workLocation: '',
    distance: 0,
    travelTime: 0,
  });
  const [employers, setEmployers] = useState<Employer[]>([]);
  const [message, setMessage] = useState('');
  const [calculatedDistance, setCalculatedDistance] = useState<string | null>(null);
  const [calculatedTravelTime, setCalculatedTravelTime] = useState<string | null>(null);
  const [scriptLoaded, setScriptLoaded] = useState(false);
  const mapRef = useRef<HTMLDivElement>(null);
  const homeInputRef = useRef<HTMLInputElement>(null);
  const workInputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  // Fetch employers on component mount
  useEffect(() => {
    const fetchEmployers = async () => {
      const response = await apiCall<Employer[]>('/api/employers');
      if (response.data) {
        const employerList = response.data; // Assign to a variable to help TypeScript
        setEmployers(employerList);
        if (employerList.length > 0) {
          setFormData((prev) => ({ ...prev, employerUserName: employerList[0].userName }));
        }
      } else {
        setMessage(response.error || 'Failed to fetch employers');
      }
    };
    fetchEmployers();
  }, []);

  // Initialize Google Maps Autocomplete and Map
  useEffect(() => {
    if (!scriptLoaded || !window.google || !homeInputRef.current || !workInputRef.current || !mapRef.current) return;

    // Initialize Autocomplete for search bars
    const homeAutocomplete = new google.maps.places.Autocomplete(homeInputRef.current, {
      types: ['geocode'],
      componentRestrictions: { country: 'us' },
    });

    const workAutocomplete = new google.maps.places.Autocomplete(workInputRef.current, {
      types: ['geocode'],
      componentRestrictions: { country: 'us' },
    });

    homeAutocomplete.addListener('place_changed', () => {
      const place = homeAutocomplete.getPlace();
      const formattedAddress = place.formatted_address || '';
      setFormData((prev) => ({ ...prev, homeLocation: formattedAddress }));
    });

    workAutocomplete.addListener('place_changed', () => {
      const place = workAutocomplete.getPlace();
      const formattedAddress = place.formatted_address || '';
      setFormData((prev) => ({ ...prev, workLocation: formattedAddress }));
    });

    // Initialize the map
    const map = new google.maps.Map(mapRef.current, {
      center: { lat: 26.3683, lng: -80.1289 }, // Boca Raton, Florida
      zoom: 8,
    });

    const directionsService = new google.maps.DirectionsService();
    const directionsRenderer = new google.maps.DirectionsRenderer();
    directionsRenderer.setMap(map);

    // Function to update the route on the map
    const updateRoute = () => {
      if (!formData.homeLocation || !formData.workLocation) return;

      directionsService.route(
        {
          origin: formData.homeLocation,
          destination: formData.workLocation,
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
  }, [scriptLoaded, formData.homeLocation, formData.workLocation]);

  // Calculate distance and travel time when locations change
  useEffect(() => {
    if (!scriptLoaded || !window.google || !formData.homeLocation || !formData.workLocation) return;

    const distanceMatrixService = new google.maps.DistanceMatrixService();

    const calculateDistance = () => {
      distanceMatrixService.getDistanceMatrix(
        {
          origins: [formData.homeLocation],
          destinations: [formData.workLocation],
          travelMode: google.maps.TravelMode.DRIVING,
          unitSystem: google.maps.UnitSystem.IMPERIAL,
        },
        (response: google.maps.DistanceMatrixResponse | null, status: google.maps.DistanceMatrixStatus) => {
          if (status === 'OK' && response?.rows[0]?.elements[0]?.status === 'OK') {
            const distanceText = response.rows[0].elements[0].distance.text;
            const distanceValue = response.rows[0].elements[0].distance.value / 1609.34; // Convert meters to miles
            const travelTimeText = response.rows[0].elements[0].duration.text;
            const travelTimeValue = Math.round(response.rows[0].elements[0].duration.value / 60); // Convert seconds to minutes
            setCalculatedDistance(distanceText);
            setCalculatedTravelTime(travelTimeText);

            // Update formData with calculated values
            setFormData((prev) => ({
              ...prev,
              distance: distanceValue,
              travelTime: travelTimeValue,
            }));
          } else {
            setCalculatedDistance('Unable to calculate distance');
            setCalculatedTravelTime('Unable to calculate travel time');
            setMessage('Failed to calculate distance and travel time');
          }
        }
      );
    };

    calculateDistance();
  }, [scriptLoaded, formData.homeLocation, formData.workLocation]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage('');

    // Prepare the data to send, including calculated distance and travelTime
    const submissionData = {
      ...formData,
      distance: formData.distance || 0,
      travelTime: formData.travelTime || 0,
    };

    const response = await apiCall<{ employeeId: string }>(
      '/api/employees/register',
      'POST',
      submissionData
    );

    if (response.data) {
      setMessage('Registration successful! Redirecting to dashboard...');
      setTimeout(() => {
        router.push(`/employee/dashboard?employeeId=${response?.data?.employeeId}`);
      }, 2000);
    } else {
      setMessage(response.error || 'Registration failed');
    }
  };

  return (
    <div className="container mx-auto p-4">
      <Script
        src={`https://maps.googleapis.com/maps/api/js?key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}&libraries=places`}
        strategy="afterInteractive"
        onLoad={() => setScriptLoaded(true)}
        onError={(e) => console.error('Google Maps script failed to load:', e)}
      />
      <h2 className="text-2xl font-bold mb-4">Employee Registration</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block mb-1">Name</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className="border p-2 w-full"
            required
          />
        </div>
        <div>
          <label className="block mb-1">Username</label>
          <input
            type="text"
            name="userName"
            value={formData.userName}
            onChange={handleChange}
            className="border p-2 w-full"
            required
          />
        </div>
        <div>
          <label className="block mb-1">Email</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className="border p-2 w-full"
            required
          />
        </div>
        <div>
          <label className="block mb-1">Password</label>
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            className="border p-2 w-full"
            required
          />
        </div>
        <div>
          <label className="block mb-1">Employer Username</label>
          <select
            name="employerUserName"
            value={formData.employerUserName}
            onChange={handleChange}
            className="border p-2 w-full"
            required
          >
            {employers.length === 0 ? (
              <option value="">No employers available</option>
            ) : (
              employers.map((employer) => (
                <option key={employer._id} value={employer.userName}>
                  {employer.userName}
                </option>
              ))
            )}
          </select>
        </div>
        <div>
          <label className="block mb-1">Home Location</label>
          <input
            ref={homeInputRef}
            type="text"
            name="homeLocation"
            value={formData.homeLocation}
            onChange={handleChange}
            placeholder="Enter home location"
            className="border p-2 w-full"
            required
          />
        </div>
        <div>
          <label className="block mb-1">Work Location</label>
          <input
            ref={workInputRef}
            type="text"
            name="workLocation"
            value={formData.workLocation}
            onChange={handleChange}
            placeholder="Enter work location"
            className="border p-2 w-full"
            required
          />
        </div>
        {calculatedDistance && calculatedTravelTime && (
          <div>
            <p><strong>Distance:</strong> {calculatedDistance}</p>
            <p><strong>Travel Time:</strong> {calculatedTravelTime}</p>
          </div>
        )}
        <div className="mt-4">
          <h3 className="text-xl font-semibold mb-2">Route</h3>
          <div ref={mapRef} className="w-full h-96"></div>
        </div>
        <button type="submit" className="bg-blue-500 text-white p-2">
          Register
        </button>
      </form>
      {message && <p className="mt-2 text-green-600">{message}</p>}
    </div>
  );
};

export default EmployeeRegister;