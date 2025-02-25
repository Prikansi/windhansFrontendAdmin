import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: 'http://localhost:4000', // Replace with your actual API base URL
  headers: {
    'Content-Type': 'application/json',
    Authorization: 'Bearer your-token', // Add authorization if required
  },
});

export default axiosInstance;
