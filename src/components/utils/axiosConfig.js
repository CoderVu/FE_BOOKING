import axios from 'axios';

const instance = axios.create({
  baseURL: 'http://localhost:8081', // Đặt baseURL tại đây
});

export default instance;
