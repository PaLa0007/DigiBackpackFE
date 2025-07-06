import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import React, { useState } from 'react';
import { Button, FlatList, StyleSheet, Text, TextInput, View } from 'react-native';
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
    const [newComment, setNewComment] = useState('');
    const queryClient = useQueryClient();

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

    const addCommentMutation = useMutation({
        mutationFn: async () => {
            if (!user) return;
            if (assignmentId) {
                return postAssignmentComment(assignmentId, user.id, newComment);
            } else {
                return postClassroomComment(classroomId, user.id, newComment);
            }
        },
        onSuccess: () => {
            setNewComment('');
            queryClient.invalidateQueries({ queryKey });
        },
    });

    const handleAddComment = () => {
        if (newComment.trim() === '') return;
        addCommentMutation.mutate();
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Comments</Text>
            {commentsQuery.data && commentsQuery.data.length > 0 ? (
                <FlatList
                    data={commentsQuery.data}
                    keyExtractor={(item) => item.id.toString()}
                    renderItem={({ item }) => (
                        <CommentCard comment={item} queryKey={queryKey} />
                    )}
                />
            ) : (
                <Text style={styles.noComments}>No comments yet.</Text>
            )}
            <TextInput
                style={styles.input}
                placeholder="Write a comment..."
                value={newComment}
                onChangeText={setNewComment}
            />
            <Button
                title="Post Comment"
                onPress={handleAddComment}
                disabled={newComment.trim() === '' || addCommentMutation.isPending}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: { marginTop: 16 },
    title: { fontSize: 16, fontWeight: 'bold', color: '#124E57', marginBottom: 8 },
    input: { borderWidth: 1, borderColor: '#ccc', padding: 8, borderRadius: 8, marginBottom: 8 },
    noComments: { fontSize: 12, color: '#777', marginBottom: 8 },
});

export default CommentSection;
