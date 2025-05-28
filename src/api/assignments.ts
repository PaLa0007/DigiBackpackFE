import api from './api';

export type AssignmentDto = {
  id: number;
  title: string;
  description: string;
  dueDate: string;
  createdById: number;
  classroomId: number;
};

export const fetchAssignments = async (): Promise<AssignmentDto[]> => {
  const response = await api.get<AssignmentDto[]>('/assignments');
  return response.data;
};

export const fetchAssignmentById = async (id: number): Promise<AssignmentDto> => {
  const response = await api.get<AssignmentDto>(`/assignments/${id}`);
  return response.data;
};

export type CreateAssignmentPayload = Omit<AssignmentDto, 'id'>;

export const createAssignment = async (
  payload: CreateAssignmentPayload
): Promise<AssignmentDto> => {
  const response = await api.post<AssignmentDto>('/assignments', payload);
  return response.data;
};

export const updateAssignment = async (
  id: number,
  payload: CreateAssignmentPayload
): Promise<AssignmentDto> => {
  const response = await api.put<AssignmentDto>(`/assignments/${id}`, payload);
  return response.data;
};

export const deleteAssignment = async (id: number): Promise<void> => {
  await api.delete(`/assignments/${id}`);
};
