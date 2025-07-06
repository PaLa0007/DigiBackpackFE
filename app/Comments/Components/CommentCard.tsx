import { useMutation, useQueryClient } from '@tanstack/react-query';
import React, { useState } from 'react';
import { Button, StyleSheet, Text, TextInput, View } from 'react-native';
import { CommentDto, deleteComment, updateComment } from '../../../src/api/comments';
import { useAuth } from '../../../src/store/auth';

type Props = {
    comment: CommentDto;
    queryKey: any;
};

const CommentCard: React.FC<Props> = ({ comment, queryKey }) => {
    const user = useAuth(state => state.user);
    const queryClient = useQueryClient();

    const [editing, setEditing] = useState(false);
    const [editedContent, setEditedContent] = useState(comment.content);

    const editCommentMutation = useMutation({
        mutationFn: async () => {
            if (!user) return;
            return updateComment(comment.id, editedContent, user.id);
        },
        onSuccess: () => {
            setEditing(false);
            queryClient.invalidateQueries({ queryKey });
        },
    });

    const deleteCommentMutation = useMutation({
        mutationFn: async () => {  
            if (!user) return;
            return deleteComment(comment.id, user.id);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey });
        },
        onError: (error) => {
            console.error("Error deleting comment:", error);
        }
    });

    const handleSave = () => {
        if (editedContent.trim() === '') return;
        editCommentMutation.mutate();
    };

    const handleDelete = () => {
        deleteCommentMutation.mutate();
    };


    return (
        <View style={styles.commentCard}>
            <Text style={styles.commentAuthor}>
                {comment.createdByFirstName} {comment.createdByLastName}
            </Text>
            {editing ? (
                <>
                    <TextInput
                        style={styles.input}
                        value={editedContent}
                        onChangeText={setEditedContent}
                    />
                    <View style={{ flexDirection: 'row', gap: 8, marginTop: 4 }}>
                        <Button title="Save" onPress={handleSave} />
                        <Button title="Cancel" color="#888" onPress={() => setEditing(false)} />
                    </View>
                </>
            ) : (
                <>
                    <Text style={styles.commentContent}>{comment.content}</Text>
                    <Text style={styles.commentDate}>
                        {new Date(comment.createdAt).toLocaleDateString()}{' '}
                        {new Date(comment.createdAt).toLocaleTimeString()}
                    </Text>
                    {user?.id === comment.createdById && (
                        <View style={{ flexDirection: 'row', gap: 8, marginTop: 4 }}>
                            <Button title="Edit" onPress={() => setEditing(true)} />
                            <Button title="Delete" color="#D32F2F" onPress={handleDelete} />
                        </View>
                    )}
                </>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    commentCard: { backgroundColor: '#F9F9F9', padding: 8, borderRadius: 8, marginBottom: 6 },
    commentAuthor: { fontWeight: '600', color: '#124E57' },
    commentContent: { color: '#333', marginTop: 2 },
    commentDate: { fontSize: 10, color: '#777', marginTop: 2 },
    input: { borderWidth: 1, borderColor: '#ccc', padding: 8, borderRadius: 8, marginTop: 4 },
});

export default CommentCard;
