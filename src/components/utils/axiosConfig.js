import axios from 'axios';

const instance = axios.create({
  baseURL: 'http://localhost:8081',
  headers: {
    'Content-Type': 'application/json',
  },
});

instance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    console.log('configg', config);
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default instance;
