import api from './api';

export type Subject = {
  id: number;
  name: string;
  schoolId: number;
};

// Get subjects by school
export const fetchSubjectsBySchool = async (schoolId: number): Promise<Subject[]> => {
  const response = await api.get<Subject[]>(`/subjects/school/${schoolId}`);
  return response.data;
};

// Create a new subject
export const createSubject = async (payload: Omit<Subject, 'id'>): Promise<Subject> => {
  const response = await api.post<Subject>('/subjects', payload);
  return response.data;
};

// Update a subject
export const updateSubject = async (id: number, payload: Omit<Subject, 'id'>): Promise<Subject> => {
  const response = await api.put<Subject>(`/subjects/${id}`, payload);
  return response.data;
};

// Delete a subject
export const deleteSubject = async (id: number): Promise<void> => {
  await api.delete(`/subjects/${id}`);
};
