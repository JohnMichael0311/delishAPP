import axios from 'axios';

// Set base URL based on environment
// Use relative baseURL for all environments except explicit local development
const isLocalDev = window.location.hostname === 'localhost' && window.location.port === '3000';
const baseURL = isLocalDev ? 'http://localhost:5000' : '/';
axios.defaults.baseURL = baseURL;

// Add request interceptor for debugging
axios.interceptors.request.use(request => {
  console.log('Starting Request:', request.url);
  return request;
});

// Add response interceptor for debugging
axios.interceptors.response.use(
  response => {
    console.log('Response:', response);
    return response;
  },
  error => {
    console.error('Request Failed:', error.config);
    if (error.response) {
      console.error('Status:', error.response.status);
      console.error('Data:', error.response.data);
    }
    return Promise.reject(error);
  }
);
