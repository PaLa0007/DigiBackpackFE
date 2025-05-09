import axios from 'axios';

const api = axios.create({
  baseURL: 'http://192.168.31.100:8165/api/schools',
});

export const fetchSchools = async () => {
  const response = await api.get('');
  return response.data;
};

export const fetchSchoolById = async (id: number) => {
  const response = await fetch(`http://your-backend-url/api/schools/${id}`);
  return response.json();
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

export const updateSchool = async (id: number, schoolData: any) => {
  const response = await fetch(`http://localhost:8165/api/schools/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(schoolData),
  });
  return response.json();
};

export const deleteSchool = async (id: number) => {
  await fetch(`http://localhost:8165/api/schools/${id}`, {
    method: 'DELETE',
  });
};

export const registerSchoolAdmin = async (id: number, adminData: any) => {
  const response = await fetch(`http://localhost:8165/api/schools/${id}/register-admin`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(adminData),
  });
  return response.json();
};
