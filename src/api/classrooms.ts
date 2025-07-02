import api from './api';

export type Classroom = {
    id: number;
    name: string;
    grade: number;
    subject?: {
        id: number;
        name: string;
    };
    school?: {
        id: number;
        name: string;
    };
};

export type ClassroomPayload = {
    name: string;
    grade: string;
    teacherId?: number;
    subjectId: number;
};

// Fetch all classrooms for a school
export const fetchSchoolClassrooms = async (schoolId: number): Promise<Classroom[]> => {
    const response = await api.get<Classroom[]>('/classrooms', {
        params: { schoolId },
    });
    return response.data;
};


// Fetch all classrooms for a teacher
export const fetchTeacherClassrooms = async (teacherId: number): Promise<Classroom[]> => {
    const response = await api.get<Classroom[]>('/classrooms', {
        params: { teacherId },
    });
    return response.data;
};

// Fetch single classroom by ID
export const fetchClassroomById = async (id: number): Promise<Classroom> => {
    const response = await api.get<Classroom>(`/classrooms/${id}`);
    return response.data;
};

//Create new classroom
export const createClassroom = async (payload: ClassroomPayload): Promise<Classroom> => {
    const response = await api.post<Classroom>('/classrooms', payload);
    return response.data;
};

//Update existing classroom
export const updateClassroom = async (id: number, payload: ClassroomPayload): Promise<Classroom> => {
    const response = await api.put<Classroom>(`/classrooms/${id}`, payload);
    return response.data;
};

//Delete classroom
export const deleteClassroom = async (id: number): Promise<void> => {
    await api.delete(`/classrooms/${id}`);
};

//Unified feed model
export type FeedItem = {
    type: 'assignment' | 'material' | 'message';
    title?: string;
    description: string;
    createdAt: string;
    createdBy: string;
    id?: number; // ← will be the assignment ID when type === 'assignment'
    fileUrl?: string;
};

//Fetch classroom feed
export const fetchClassroomFeed = async (classroomId: number): Promise<FeedItem[]> => {
    const response = await api.get<FeedItem[]>(`/classrooms/${classroomId}/feed`);
    return response.data.map(item => ({
        id: item.id,
        type: item.type,
        title: item.title,
        description: item.description,
        createdAt: item.createdAt,
        createdBy: item.createdBy,
        fileUrl: item.fileUrl ?? undefined,
    }));
};
