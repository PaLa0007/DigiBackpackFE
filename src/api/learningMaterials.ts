import api from './api';

export type LearningMaterialDto = {
    id: number;
    title: string;
    description: string;
    fileUrl: string;
    uploadedById: number;
    classroomId: number;
};

export const fetchMaterialsByClassroom = async (classroomId: number): Promise<LearningMaterialDto[]> => {
    const response = await api.get(`/learning-materials/classroom/${classroomId}`);
    return response.data;
};

export const uploadLearningMaterial = async (
    formData: FormData
): Promise<LearningMaterialDto> => {
    const response = await fetch('http://192.168.31.100:8165/api/learning-materials/upload', {
        method: 'POST',
        body: formData,
    });

    if (!response.ok) {
        const errorText = await response.text();
        console.error('Upload failed:', errorText);
        throw new Error('Upload failed: ' + response.status);
    }

    const data = await response.json();
    return data;
};

export const deleteLearningMaterial = async (id: number): Promise<void> => {
    await api.delete(`/learning-materials/${id}`);
};

export const fetchLearningMaterials = async (): Promise<LearningMaterialDto[]> => {
    const response = await api.get('/learning-materials');
    return response.data;
};

