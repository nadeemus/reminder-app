import React, { useState } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import LocationPicker from './LocationPicker';
import './ReminderForm.css';

const ReminderForm = ({ onSubmit, onCancel, initialData = null }) => {
  const [formData, setFormData] = useState({
    title: initialData?.title || '',
    description: initialData?.description || '',
    dueDate: initialData?.dueDate ? new Date(initialData.dueDate) : null,
    priority: initialData?.priority || 'medium',
    locationName: initialData?.location?.name || '',
    latitude: initialData?.location?.latitude || '',
    longitude: initialData?.location?.longitude || '',
    radius: initialData?.location?.radius || 100,
  });
  const [showMap, setShowMap] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleDateChange = (date) => {
    setFormData((prev) => ({
      ...prev,
      dueDate: date,
    }));
  };

  const handleLocationSelect = (location) => {
    setFormData((prev) => ({
      ...prev,
      locationName: location.name,
      latitude: location.latitude,
      longitude: location.longitude,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    const submitData = {
      title: formData.title,
      description: formData.description,
      dueDate: formData.dueDate ? formData.dueDate.toISOString() : null,
      priority: formData.priority,
    };

    // Add location data if provided
    if (formData.locationName || formData.latitude || formData.longitude) {
      // Validate that all location fields are provided
      if (!formData.locationName || !formData.latitude || !formData.longitude) {
        alert('Please provide all location fields (name, latitude, and longitude) or leave them all empty.');
        return;
      }

      const lat = parseFloat(formData.latitude);
      const lon = parseFloat(formData.longitude);
      const rad = parseInt(formData.radius);

      // Validate parsed values
      if (isNaN(lat) || isNaN(lon) || isNaN(rad)) {
        alert('Please enter valid numeric values for latitude, longitude, and radius.');
        return;
      }

      // Validate ranges
      if (lat < -90 || lat > 90) {
        alert('Latitude must be between -90 and 90.');
        return;
      }

      if (lon < -180 || lon > 180) {
        alert('Longitude must be between -180 and 180.');
        return;
      }

      if (rad < 10 || rad > 5000) {
        alert('Radius must be between 10 and 5000 meters.');
        return;
      }

      submitData.location = {
        name: formData.locationName.trim(),
        latitude: lat,
        longitude: lon,
        radius: rad
      };
    }

    onSubmit(submitData);
  };

  return (
    <div className="reminder-form-container">
      <form onSubmit={handleSubmit} className="reminder-form">
        <h2>{initialData ? 'Edit Reminder' : 'Add New Reminder'}</h2>
        
        <div className="form-group">
          <label htmlFor="title">Title *</label>
          <input
            type="text"
            id="title"
            name="title"
            value={formData.title}
            onChange={handleChange}
            required
            maxLength={100}
            placeholder="Enter reminder title"
          />
        </div>

        <div className="form-group">
          <label htmlFor="description">Description</label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            maxLength={500}
            rows={4}
            placeholder="Enter reminder description (optional)"
          />
        </div>

        <div className="form-group">
          <label htmlFor="dueDate">Due Date & Time *</label>
          <DatePicker
            selected={formData.dueDate}
            onChange={handleDateChange}
            showTimeSelect
            timeFormat="HH:mm"
            timeIntervals={15}
            dateFormat="MMMM d, yyyy h:mm aa"
            placeholderText="Select date and time"
            className="date-picker-input"
            minDate={new Date()}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="priority">Priority</label>
          <select
            id="priority"
            name="priority"
            value={formData.priority}
            onChange={handleChange}
          >
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
          </select>
        </div>

        <div className="form-group location-section">
          <h3>Location-Based Reminder (Optional)</h3>
          <p className="location-hint">Get reminded when you're near a specific location</p>
          
          <div className="form-group">
            <label htmlFor="locationName">Location Name</label>
            <input
              type="text"
              id="locationName"
              name="locationName"
              value={formData.locationName}
              onChange={handleChange}
              maxLength={200}
              placeholder="e.g., Grocery Store, Office, Pharmacy"
            />
          </div>

          {!showMap && (
            <button
              type="button"
              onClick={() => setShowMap(true)}
              className="btn btn-map-toggle"
            >
              📍 Select Location on Map
            </button>
          )}

          {showMap && (
            <>
              <LocationPicker
                location={{
                  name: formData.locationName,
                  latitude: formData.latitude,
                  longitude: formData.longitude
                }}
                onLocationSelect={handleLocationSelect}
              />
              
              <div className="location-coordinates">
                <div className="coordinate-display">
                  <strong>Selected Location:</strong>
                  {formData.latitude && formData.longitude ? (
                    <span>
                      Lat: {typeof formData.latitude === 'number' ? formData.latitude.toFixed(6) : parseFloat(formData.latitude).toFixed(6)}, 
                      Lng: {typeof formData.longitude === 'number' ? formData.longitude.toFixed(6) : parseFloat(formData.longitude).toFixed(6)}
                    </span>
                  ) : (
                    <span className="no-location">No location selected</span>
                  )}
                </div>
              </div>
            </>
          )}

          <div className="form-group">
            <label htmlFor="radius">Notification Radius: {formData.radius} meters</label>
            <input
              type="range"
              id="radius"
              name="radius"
              value={formData.radius}
              onChange={handleChange}
              min="10"
              max="5000"
              step="10"
              className="radius-slider"
            />
            <div className="radius-labels">
              <span>10m</span>
              <span>5000m</span>
            </div>
            <small className="form-hint">Distance from location to trigger reminder (10-5000 meters)</small>
          </div>
        </div>

        <div className="form-actions">
          <button type="submit" className="btn btn-primary">
            {initialData ? 'Update' : 'Create'} Reminder
          </button>
          {onCancel && (
            <button type="button" onClick={onCancel} className="btn btn-secondary">
              Cancel
            </button>
          )}
        </div>
      </form>
    </div>
  );
};

export default ReminderForm;
