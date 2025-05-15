import api from './api'; // shared axios instance

export type School = {
  id: number;
  name: string;
  address: string;
  city: string;
  country: string;
};

export const fetchSchools = async (): Promise<School[]> => {
  const response = await api.get<School[]>('/schools');
  return response.data;
};

export const fetchSchoolById = async (id: number): Promise<School> => {
  const response = await api.get<School>(`/schools/${id}`);
  return response.data;
};

export const addSchool = async (school: Omit<School, 'id'>): Promise<School> => {
  const response = await api.post('/schools', school);
  return response.data;
};

export const updateSchool = async (id: number, schoolData: Partial<School>): Promise<School> => {
  const response = await api.put(`/schools/${id}`, schoolData);
  return response.data;
};

export const deleteSchool = async (id: number): Promise<void> => {
  await api.delete(`/schools/${id}`);
};
