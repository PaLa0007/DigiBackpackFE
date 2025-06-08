import api from './api';

export type Schedule = {
    id?: number;
    dayOfWeek: string;         // e.g. "MONDAY"
    startTime: string;         // "08:00"
    endTime: string;           // "08:45"
    classroomId: number;
    classroomName?: string;
    subjectId: number;
    subjectName?: string;
    teacherId: number;
    teacherName?: string;
};

// Fetch all schedules for a classroom
export const fetchSchedulesByClassroom = async (classroomId: number): Promise<Schedule[]> => {
    const response = await api.get<Schedule[]>(`/schedules?classroomId=${classroomId}`);
    return response.data;
};

// Get schedule for a specific student (by ID)
export const fetchScheduleForStudent = async (studentId: number): Promise<Schedule[]> => {
    const response = await api.get<Schedule[]>(`/schedules/student/${studentId}`);
    return response.data;
};

// Get schedule for specific grade
export const fetchSchedulesByGrade = async (grade: string): Promise<Schedule[]> => {
    const response = await api.get<Schedule[]>(`/schedules/grade/${grade}`);
    return response.data;
};

// Create a new schedule block
export const createSchedule = async (payload: Schedule): Promise<Schedule> => {
    const response = await api.post<Schedule>('/schedules', payload);
    return response.data;
};

// Update an existing schedule block
export const updateSchedule = async (id: number, payload: Schedule): Promise<Schedule> => {
    const response = await api.put<Schedule>(`/schedules/${id}`, payload);
    return response.data;
};

// Delete a schedule block
export const deleteSchedule = async (id: number): Promise<void> => {
    await api.delete(`/schedules/${id}`);
};



