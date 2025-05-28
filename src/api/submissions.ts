import * as FileSystem from 'expo-file-system';
import api from './api';

export type SubmissionDto = {
  id: number;
  fileName: string;
  filePath: string;
  submittedAt: string;
  studentId: number;
  assignmentId: number;
};

export const fetchSubmissions = async (assignmentId: number): Promise<SubmissionDto[]> => {
  const response = await api.get<SubmissionDto[]>(`/submissions/assignment/${assignmentId}`);
  return response.data;
};

export const uploadSubmission = async (
  assignmentId: number,
  studentId: number,
  file: {
    uri: string;
    name: string;
    type: string;
  }
): Promise<void> => {
  const formData = new FormData();
  formData.append('file', {
    uri: file.uri,
    name: file.name,
    type: file.type || 'application/octet-stream',
  } as any); // workaround for React Native FormData

  await api.post(`/submissions/${assignmentId}/upload?studentId=${studentId}`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
};

export const deleteSubmission = async (id: number): Promise<void> => {
  await api.delete(`/submissions/${id}`);
};

export const downloadSubmission = async (id: number): Promise<string> => {
  const downloadUrl = `/submissions/${id}/download`;
  const localUri = `${FileSystem.documentDirectory}submission_${id}.pdf`;

  const { uri } = await FileSystem.downloadAsync(api.defaults.baseURL + downloadUrl, localUri);
  return uri;
};
