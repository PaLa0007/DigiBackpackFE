import api from './api';

export type StudentClassroomDto = {
  id: number;
  studentId: number;
  classroomId: number;
};

// Fetch all student-classroom associations
export const fetchAllStudentClassrooms = async (): Promise<StudentClassroomDto[]> => {
  const response = await api.get<StudentClassroomDto[]>('/student-classrooms');
  return response.data;
};

// Assign a single student to a classroom
export const assignStudentToClassroom = async (
  payload: Omit<StudentClassroomDto, 'id'>
): Promise<StudentClassroomDto> => {
  const response = await api.post<StudentClassroomDto>('/student-classrooms', payload);
  return response.data;
};

// Assign multiple students to a classroom
export const assignStudentsBulk = async (
  payload: Omit<StudentClassroomDto, 'id'>[]
): Promise<StudentClassroomDto[]> => {
  const response = await api.post<StudentClassroomDto[]>('/student-classrooms/bulk', payload);
  return response.data;
};

// Remove a student-classroom association by ID
export const removeStudentFromClassroom = async (id: number): Promise<void> => {
  await api.delete(`/student-classrooms/removeStudent/${id}`);
};
