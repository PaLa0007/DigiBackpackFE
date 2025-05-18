import api from './api';

export type Classroom = {
  id: number;
  name: string;
  grade: number;
  subject: {
    id: number;
    name: string;
  };
  school: {
    id: number;
    name: string;
  };
};

export const fetchTeacherClassrooms = async (teacherId: number): Promise<Classroom[]> => {
  const response = await api.get<Classroom[]>(`/teachers/${teacherId}/classrooms`);
  return response.data;
};

export type FeedItem = {
  type: 'assignment' | 'material' | 'message';
  title?: string;
  description: string;
  createdAt: string;
};

export const fetchClassroomFeed = async (classroomId: number): Promise<FeedItem[]> => {
  const response = await api.get<FeedItem[]>(`/classrooms/${classroomId}/feed`);
  return response.data;
};
