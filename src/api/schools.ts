import axios from 'axios';

const api = axios.create({
  baseURL: 'http://192.168.31.100:8165/api/schools',
});

export const fetchSchools = async () => {
  const response = await api.get('');
  return response.data;
};

export const addSchool = async (school: {
  name: string;
  address: string;
  city: string;
  country: string;
}) => {
  const response = await axios.post('http://localhost:8165/api/schools', school);
  return response.data;
};
