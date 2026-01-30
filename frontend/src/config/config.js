// Centralized configuration for frontend
export const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';
export const BACKEND_URL = process.env.REACT_APP_API_URL?.replace('/api', '') || 'http://localhost:5000';
export const GOOGLE_MAPS_API_KEY = process.env.REACT_APP_GOOGLE_MAPS_API_KEY || '';
