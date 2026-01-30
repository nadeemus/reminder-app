import React, { useState, useCallback } from 'react';
import { GoogleMap, LoadScript, Marker } from '@react-google-maps/api';
import { GOOGLE_MAPS_API_KEY } from '../config/config';
import './LocationPicker.css';

const containerStyle = {
  width: '100%',
  height: '400px',
  borderRadius: '4px'
};

const defaultCenter = {
  lat: 37.7749,
  lng: -122.4194
};

const LocationPicker = ({ location, onLocationSelect }) => {
  const [map, setMap] = useState(null);
  const [center, setCenter] = useState(
    location?.latitude && location?.longitude
      ? { lat: location.latitude, lng: location.longitude }
      : defaultCenter
  );
  const [marker, setMarker] = useState(
    location?.latitude && location?.longitude
      ? { lat: location.latitude, lng: location.longitude }
      : null
  );
  const [isGeocoding, setIsGeocoding] = useState(false);

  const onLoad = useCallback((map) => {
    setMap(map);
  }, []);

  const onUnmount = useCallback(() => {
    setMap(null);
  }, []);

  const handleMapClick = useCallback(async (e) => {
    const lat = e.latLng.lat();
    const lng = e.latLng.lng();
    
    setMarker({ lat, lng });
    
    // Reverse geocode to get location name
    setIsGeocoding(true);
    try {
      const geocoder = new window.google.maps.Geocoder();
      const result = await new Promise((resolve, reject) => {
        geocoder.geocode({ location: { lat, lng } }, (results, status) => {
          if (status === 'OK' && results[0]) {
            resolve(results[0]);
          } else {
            reject(new Error('Geocoding failed'));
          }
        });
      });

      const locationName = result.formatted_address;
      
      onLocationSelect({
        name: locationName,
        latitude: lat,
        longitude: lng
      });
    } catch (error) {
      console.error('Geocoding error:', error);
      // Still set the coordinates even if geocoding fails
      onLocationSelect({
        name: '',
        latitude: lat,
        longitude: lng
      });
    } finally {
      setIsGeocoding(false);
    }
  }, [onLocationSelect]);

  const handleUseCurrentLocation = useCallback(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const lat = position.coords.latitude;
          const lng = position.coords.longitude;
          
          setCenter({ lat, lng });
          setMarker({ lat, lng });
          
          if (map) {
            map.panTo({ lat, lng });
          }

          // Reverse geocode to get location name
          setIsGeocoding(true);
          try {
            const geocoder = new window.google.maps.Geocoder();
            const result = await new Promise((resolve, reject) => {
              geocoder.geocode({ location: { lat, lng } }, (results, status) => {
                if (status === 'OK' && results[0]) {
                  resolve(results[0]);
                } else {
                  reject(new Error('Geocoding failed'));
                }
              });
            });

            const locationName = result.formatted_address;
            
            onLocationSelect({
              name: locationName,
              latitude: lat,
              longitude: lng
            });
          } catch (error) {
            console.error('Geocoding error:', error);
            onLocationSelect({
              name: '',
              latitude: lat,
              longitude: lng
            });
          } finally {
            setIsGeocoding(false);
          }
        },
        (error) => {
          console.error('Error getting current location:', error);
          alert('Unable to get your current location. Please ensure location services are enabled.');
        }
      );
    } else {
      alert('Geolocation is not supported by your browser.');
    }
  }, [map, onLocationSelect]);

  if (!GOOGLE_MAPS_API_KEY) {
    return (
      <div className="location-picker-error">
        <p>Google Maps API key is not configured.</p>
        <p>Please add REACT_APP_GOOGLE_MAPS_API_KEY to your .env file.</p>
      </div>
    );
  }

  return (
    <div className="location-picker">
      <div className="location-picker-header">
        <p className="location-picker-instructions">
          Click on the map to select a location, or use your current location.
        </p>
        <button
          type="button"
          onClick={handleUseCurrentLocation}
          className="btn btn-location"
          disabled={isGeocoding}
        >
          📍 Use Current Location
        </button>
      </div>

      <LoadScript googleMapsApiKey={GOOGLE_MAPS_API_KEY}>
        <GoogleMap
          mapContainerStyle={containerStyle}
          center={center}
          zoom={13}
          onLoad={onLoad}
          onUnmount={onUnmount}
          onClick={handleMapClick}
        >
          {marker && <Marker position={marker} />}
        </GoogleMap>
      </LoadScript>

      {isGeocoding && (
        <div className="location-picker-loading">
          Getting location name...
        </div>
      )}
    </div>
  );
};

export default LocationPicker;
