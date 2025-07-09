import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import React, { useState } from 'react';
import { Button, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import {
    fetchAssignmentComments,
    fetchClassroomComments,
    postAssignmentComment,
    postClassroomComment,
} from '../../../src/api/comments';
import { useAuth } from '../../../src/store/auth';
import CommentCard from './CommentCard';

type Props = {
    classroomId: number;
    assignmentId?: number;
};

const CommentSection: React.FC<Props> = ({ classroomId, assignmentId }) => {
    const user = useAuth(state => state.user);
    const queryClient = useQueryClient();
    const [replyText, setReplyText] = useState<{ [studentId: number]: string }>({});
    const [newComment, setNewComment] = useState('');

    const queryKey = assignmentId
        ? ['assignment-comments', assignmentId, user?.id]
        : ['classroom-comments', classroomId];

    const commentsQuery = useQuery({
        queryKey,
        queryFn: () =>
            assignmentId && user
                ? fetchAssignmentComments(assignmentId, user.id)
                : fetchClassroomComments(classroomId),
        enabled: !!user,
    });

    const postComment = useMutation({
        mutationFn: async ({ content, studentId }: { content: string; studentId?: number }) => {
            if (!user) return;
            if (assignmentId) {
                return postAssignmentComment(assignmentId, user.id, content, studentId);
            } else {
                return postClassroomComment(classroomId, user.id, content);
            }
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey });
            setNewComment('');
        },
    });

    const handlePostTeacherReply = (studentId: number) => {
        if (!replyText[studentId]?.trim()) return;
        postComment.mutate({ content: replyText[studentId], studentId });
        setReplyText(prev => ({ ...prev, [studentId]: '' }));
    };

    if (!commentsQuery.data) {
        return <Text style={styles.loading}>Loading comments...</Text>;
    }

    if (user?.role === 'TEACHER') {
        const groupedComments = commentsQuery.data.reduce((acc, comment) => {
            const studentId = comment.createdByRole === 'STUDENT'
                ? comment.createdById
                : comment.recipientStudentId;

            if (!studentId) return acc;

            if (!acc[studentId]) {
                acc[studentId] = {
                    studentId,
                    studentName: comment.createdByRole === 'STUDENT'
                        ? `${comment.createdByFirstName} ${comment.createdByLastName}`
                        : 'Unknown Student',
                    comments: [],
                };
            }
            acc[studentId].comments.push(comment);
            return acc;
        }, {} as Record<number, { studentId: number, studentName: string, comments: any[] }>);

        Object.values(groupedComments).forEach(group => {
            group.comments.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
        });

        return (
            <ScrollView style={styles.container}>
                {Object.values(groupedComments).map(group => (
                    <View key={group.studentId} style={styles.groupCard}>
                        <Text style={styles.studentName}>{group.studentName}</Text>
                        {group.comments.map(comment => (
                            <CommentCard key={comment.id} comment={comment} queryKey={queryKey} />
                        ))}
                        <TextInput
                            placeholder={`Reply to ${group.studentName}`}
                            value={replyText[group.studentId] || ''}
                            onChangeText={text => setReplyText(prev => ({ ...prev, [group.studentId]: text }))}
                            style={styles.input}
                        />
                        <Button
                            title="Post Reply"
                            onPress={() => handlePostTeacherReply(group.studentId)}
                            disabled={!replyText[group.studentId]?.trim() || postComment.isPending}
                        />
                    </View>
                ))}
            </ScrollView>
        );
    }

    // STUDENT view fallback
    return (
        <View style={styles.container}>
            {commentsQuery.data.length === 0 && <Text style={styles.noComments}>No comments yet.</Text>}
            {commentsQuery.data.map(comment => (
                <CommentCard key={comment.id} comment={comment} queryKey={queryKey} />
            ))}
            <TextInput
                style={styles.input}
                placeholder="Write a comment..."
                value={newComment}
                onChangeText={setNewComment}
            />
            <Button
                title="Post Comment"
                onPress={() => postComment.mutate({ content: newComment })}
                disabled={!newComment.trim() || postComment.isPending}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: { marginTop: 16, paddingHorizontal: 8 },
    loading: { color: '#555', fontSize: 14, textAlign: 'center' },
    noComments: { color: '#555', fontSize: 14, textAlign: 'center', marginBottom: 8 },
    studentName: { fontWeight: '600', color: '#124E57', marginBottom: 4 },
    input: { borderWidth: 1, borderColor: '#ccc', padding: 8, borderRadius: 8, marginVertical: 8 },
    groupCard: {
        backgroundColor: '#F9F9F9',
        borderRadius: 8,
        padding: 8,
        marginBottom: 12,
        borderWidth: 1,
        borderColor: '#E0E0E0',
    },
});

export default CommentSection;