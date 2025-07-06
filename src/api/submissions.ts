import * as FileSystem from 'expo-file-system';
import { Platform } from 'react-native';
import api from './api';

export type SubmissionDto = {
  id: number;
  fileName: string; // can keep for compatibility, but no longer used
  filePath: string;
  submittedAt: string;
  studentId: number;
  assignmentId: number;
  description: string;
  files: { id: number; fileName: string; }[];

  studentFirstName?: string;
  studentLastName?: string;
};

export const fetchSubmissions = async (assignmentId: number): Promise<SubmissionDto[]> => {
  const response = await api.get<SubmissionDto[]>(`/submissions/assignment/${assignmentId}`);
  return response.data;
};

export const uploadSubmission = async (
  assignmentId: number,
  studentId: number,
  description?: string,
  files?: { uri: string; name: string; type: string }[]
): Promise<void> => {
  const formData = new FormData();
  formData.append('studentId', String(studentId));

  if (description) {
    formData.append('description', description);
  }

  if (files && files.length > 0) {
    for (const file of files) {
      if (Platform.OS === 'web') {
        try {
          const fileResponse = await fetch(file.uri);
          const blob = await fileResponse.blob();
          formData.append('files', blob, file.name);
        } catch (error) {
          console.error('Error fetching file as blob:', error);
          throw error;
        }
      } else {
        formData.append('files', {
          uri: file.uri,
          name: file.name,
          type: file.type || 'application/octet-stream',
        } as any);
      }
    }
  }

  try {
    const response = await fetch(`http://192.168.31.100:8165/api/submissions/${assignmentId}/upload`, {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Upload failed:', errorText);
      throw new Error('Upload failed: ' + response.status);
    }

    console.log('Upload successful');
  } catch (error) {
    console.error('Upload error:', error);
    throw error;
  }
};

export const deleteSubmission = async (id: number): Promise<void> => {
  await api.delete(`/submissions/${id}`);
};

export const downloadSubmissionFile = async (
  submissionId: number,
  fileId: number,
  fileName: string
): Promise<string | void> => {
  const downloadUrl = `${api.defaults.baseURL}/submissions/${submissionId}/download/${fileId}`;

  if (Platform.OS === 'web') {
    try {
      const response = await fetch(downloadUrl);
      const blob = await response.blob();

      const url = window.URL.createObjectURL(blob);
      const anchor = document.createElement('a');
      anchor.href = url;
      anchor.download = fileName;
      document.body.appendChild(anchor);
      anchor.click();

      // Cleanup
      document.body.removeChild(anchor);
      window.URL.revokeObjectURL(url);

    } catch (error) {

      throw error;
    }
    return; // done
  }

  // Android & iOS
  try {
    const fileUri = `${FileSystem.documentDirectory}${fileName}`;

    const { uri } = await FileSystem.downloadAsync(downloadUrl, fileUri);
    return uri;
  } catch (error) {
    throw error;
  }
};
