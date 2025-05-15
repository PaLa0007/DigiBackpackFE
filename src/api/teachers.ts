import api from './api'; // 👈 using your shared axios instance

export type Teacher = {
    id: number;
    firstName: string;
    lastName: string;
    email: string;
    hireDate: string;
    subjectSpecialization: string;
    phoneNumber: string;
    username: string;
    role: string;
    schoolId?: number;
};

export const fetchTeachers = async (): Promise<Teacher[]> => {
    const response = await api.get<Teacher[]>('/teachers');
    return response.data;
};

export const fetchTeacherById = async (id: number): Promise<Teacher> => {
    const response = await api.get<Teacher>(`/teachers/${id}`);
    return response.data;
};

export const searchTeachers = async (query: string): Promise<Teacher[]> => {
    const response = await api.get<Teacher[]>(`/teachers/search`, {
        params: { query },
    });
    return response.data;
};

export type CreateTeacherPayload = {
    username: string;
    email: string;
    password: string;
    firstName: string;
    lastName: string;
    hireDate: string; // ISO string from date picker
    subjectSpecialization: string;
    phoneNumber: string;
    schoolId: number;
};

export const registerTeacher = async (payload: CreateTeacherPayload) => {
    const response = await api.post('/teachers', payload);
    return response.data;
};

export type UpdateTeacherPayload =
    Omit<CreateTeacherPayload, 'password' | 'username' | 'schoolId'> & {
        schoolId?: number;
    };



export const updateTeacher = async (id: number, payload: UpdateTeacherPayload) => {
    const response = await api.put(`/teachers/${id}`, payload);
    return response.data;
};

export const deleteTeacher = async (id: number) => {
    await api.delete(`/teachers/${id}`);
};
