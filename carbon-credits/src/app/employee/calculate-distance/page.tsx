"use client";
import React, { useState, useEffect } from 'react';
import Navbar from '../../../components/navbar';
import { useAuth } from '../../../utils/authContext';
import { useRouter } from 'next/navigation';
import Script from 'next/script';

const CalculateDistancePage: React.FC = () => {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [distance, setDistance] = useState<string | null>(null);
  const [fromLocation, setFromLocation] = useState<string>('');
  const [toLocation, setToLocation] = useState<string>('');

  useEffect(() => {
    if (!loading && (!user || user.role !== 'employee')) {
      router.push('/login');
    }
  }, [user, loading, router]);

  // Initialize the map and set up markers
  const initMap = () => {
    const map = new google.maps.Map(document.getElementById('map') as HTMLElement, {
      center: { lat: 37.7749, lng: -122.4194 }, // Default to San Francisco
      zoom: 8,
    });

    const fromMarker = new google.maps.Marker({
      map,
      draggable: true,
      label: 'From',
    });

    const toMarker = new google.maps.Marker({
      map,
      draggable: true,
      label: 'To',
    });

    // Geocoder to convert lat/lng to address
    const geocoder = new google.maps.Geocoder();

    // Update "From" location when marker is dragged
    fromMarker.addListener('dragend', () => {
      const position = fromMarker.getPosition();
      if (position) {
        geocoder.geocode({ location: position }, (results, status) => {
          if (status === 'OK' && results?.[0]) {
            setFromLocation(results[0].formatted_address);
          }
        });
      }
    });

    // Update "To" location when marker is dragged
    toMarker.addListener('dragend', () => {
      const position = toMarker.getPosition();
      if (position) {
        geocoder.geocode({ location: position }, (results, status) => {
          if (status === 'OK' && results?.[0]) {
            setToLocation(results[0].formatted_address);
          }
        });
      }
    });

    // Calculate distance when both markers are placed
    const distanceMatrixService = new google.maps.DistanceMatrixService();
    const calculateDistance = () => {
      if (!fromMarker.getPosition() || !toMarker.getPosition()) return;

      distanceMatrixService.getDistanceMatrix(
        {
          origins: [fromMarker.getPosition()!],
          destinations: [toMarker.getPosition()!],
          travelMode: google.maps.TravelMode.DRIVING,
          unitSystem: google.maps.UnitSystem.IMPERIAL,
        },
        (response, status) => {
          if (status === 'OK' && response?.rows[0]?.elements[0]?.status === 'OK') {
            const distanceText = response.rows[0].elements[0].distance.text;
            setDistance(distanceText);
          } else {
            setDistance('Unable to calculate distance');
          }
        }
      );
    };

    // Recalculate distance whenever markers are moved
    fromMarker.addListener('dragend', calculateDistance);
    toMarker.addListener('dragend', calculateDistance);

    // Set initial positions for markers (optional: default locations)
    fromMarker.setPosition({ lat: 37.7749, lng: -122.4194 }); // San Francisco
    toMarker.setPosition({ lat: 37.3382, lng: -121.8863 }); // San Jose
    calculateDistance(); // Initial distance calculation
  };

  if (loading) {
    return <p className="text-center p-4">Loading authentication...</p>;
  }

  if (!user || user.role !== 'employee') {
    return <p className="text-center p-4">Redirecting to login...</p>;
  }

  return (
    <div>
      <Navbar />
      <div className="container mx-auto p-4">
        <h1 className="text-2xl font-bold mb-4">Calculate Travel Distance</h1>
        <p className="mb-4">Drag the markers to select the "From" and "To" locations, and the driving distance will be calculated in miles.</p>

        <div id="map" className="w-full h-96 mb-4"></div>

        <div className="mb-4">
          <p><strong>From:</strong> {fromLocation || 'Drag the "From" marker to select a location'}</p>
          <p><strong>To:</strong> {toLocation || 'Drag the "To" marker to select a location'}</p>
          <p><strong>Distance:</strong> {distance || 'Calculating...'}</p>
        </div>

        <Script
          src={`https://maps.googleapis.com/maps/api/js?key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}&libraries=places`}
          onLoad={initMap}
        />
      </div>
    </div>
  );
};

export default CalculateDistancePage;