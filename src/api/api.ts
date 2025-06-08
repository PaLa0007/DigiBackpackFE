// src/api/axios.ts
import axios from 'axios';

// Use LAN IP so devices can access it
const BASE_URL = 'http://192.168.31.100:8165/api';

const api = axios.create({
  baseURL: BASE_URL,
  withCredentials: true, // ✅ THIS is required for sessions/cookies
});

export default api;
