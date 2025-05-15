import axios from 'axios';

export type Student = {
  id: number;
  firstName: string;
  lastName: string;
  grade: string;
};

export const fetchStudents = async (): Promise<Student[]> => {
  const response = await axios.get<Student[]>('http://localhost:8165/api/students');
  return response.data;
};