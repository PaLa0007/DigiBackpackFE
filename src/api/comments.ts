import api from './api';

export type CommentDto = {
    id: number;
    content: string;
    createdById: number;
    createdByFirstName: string;
    createdByLastName: string;
    assignmentId?: number;
    classroomId?: number;
    learningMaterialId?: number;
    createdAt: string;
};

// Fetch classroom comments
export const fetchClassroomComments = async (classroomId: number): Promise<CommentDto[]> => {
    const response = await api.get<CommentDto[]>(`/comments/classroom/${classroomId}`);
    return response.data;
};

// Fetch assignment comments (pass userId as query param for filtering)
export const fetchAssignmentComments = async (assignmentId: number, userId: number): Promise<CommentDto[]> => {
    const response = await api.get<CommentDto[]>(`/comments/assignment/${assignmentId}`, {
        params: { userId },
    });
    return response.data;
};

// Post a classroom comment
export const postClassroomComment = async (
    classroomId: number,
    createdById: number,
    content: string
): Promise<CommentDto> => {
    const response = await api.post<CommentDto>(`/comments/classroom/${classroomId}`, {
        createdById,
        content,
    });
    return response.data;
};

// Post an assignment comment
export const postAssignmentComment = async (
    assignmentId: number,
    createdById: number,
    content: string
): Promise<CommentDto> => {
    const response = await api.post<CommentDto>(`/comments/assignment/${assignmentId}`, {
        createdById,
        content,
    });
    return response.data;
};

// Update comment
export const updateComment = async (commentId: number, content: string, userId: number): Promise<CommentDto> => {
    const response = await api.put<CommentDto>(`/comments/${commentId}`, {
        id: commentId,
        content,
        createdById: userId,
    });
    return response.data;
};

// Delete comment
export const deleteComment = async (commentId: number, userId: number): Promise<void> => {
    await api.delete(`/comments/${commentId}`, { params: { userId } });
};

