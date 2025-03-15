import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL; // Lấy URL từ biến môi trường

const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000, // Timeout sau 10s
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
});

export default axiosInstance;