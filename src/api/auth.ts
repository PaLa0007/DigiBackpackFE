import axios from 'axios';

const api = axios.create({
  baseURL: 'http://192.168.31.100:8165/api/users',
});

export const login = async (username: string, password: string) => {
  const response = await api.post('/login', null, {
    params: { username, password },
    withCredentials: true, // to allow session cookie if needed
  });
  return response.data;
};

