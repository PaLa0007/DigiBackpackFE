import api from './api'; // 👈 using your shared axios instance

export type Student = {
  id: number;
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  gradeLevel: string;
  parentName: string;
  parentPhone: string;
  role: string;
  schoolId?: number;
};

export type CreateStudentPayload = {
  username: string;
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  gradeLevel: string;
  parentName: string;
  parentPhone: string;
  schoolId: number;
};

export const fetchStudentDashboard = async (studentId: number) => {
  const response = await api.get(`/students/${studentId}/dashboard`);
  return response.data;
};

export const fetchStudents = async (): Promise<Student[]> => {
  const response = await api.get<Student[]>('/students');
  return response.data;
};

export const registerStudent = async (payload: CreateStudentPayload) => {
  const response = await api.post('/students', payload);
  return response.data;
};

export const updateStudent = async (id: number, payload: Partial<CreateStudentPayload>) => {
  const response = await api.put(`/students/${id}`, payload);
  return response.data;
};

export const deleteStudent = async (id: number) => {
  await api.delete(`/students/${id}`);
};