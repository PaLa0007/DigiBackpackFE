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
    const response = await api.post('/learning-materials/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data;
};

export const deleteLearningMaterial = async (id: number): Promise<void> => {
    await api.delete(`/learning-materials/${id}`);
};

export const fetchLearningMaterials = async (): Promise<LearningMaterialDto[]> => {
    const response = await api.get('/learning-materials');
    return response.data;
};

