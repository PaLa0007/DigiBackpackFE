import { useMutation, useQueryClient } from '@tanstack/react-query';
import React, { useState } from 'react';
import { StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
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
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                <Text style={styles.commentAuthor}>
                    {comment.createdByFirstName} {comment.createdByLastName}
                </Text>
                {user?.id === comment.createdById && !editing && (
                    <View style={styles.buttonRow}>
                        <TouchableOpacity
                            style={[styles.actionButton, { backgroundColor: '#15808D' }]}
                            onPress={() => setEditing(true)}
                        >
                            <Text style={styles.actionButtonText}>Edit</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={[styles.actionButton, { backgroundColor: '#D32F2F' }]}
                            onPress={handleDelete}
                        >
                            <Text style={styles.actionButtonText}>Delete</Text>
                        </TouchableOpacity>
                    </View>
                )}
            </View>

            {editing ? (
                <>
                    <TextInput
                        style={styles.input}
                        value={editedContent}
                        onChangeText={setEditedContent}
                    />
                    <View style={styles.buttonRow}>
                        <TouchableOpacity
                            style={[styles.actionButton, { backgroundColor: '#15808D' }]}
                            onPress={handleSave}
                        >
                            <Text style={styles.actionButtonText}>Save</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={[styles.actionButton, { backgroundColor: '#888' }]}
                            onPress={() => setEditing(false)}
                        >
                            <Text style={styles.actionButtonText}>Cancel</Text>
                        </TouchableOpacity>
                    </View>
                </>
            ) : (
                <>
                    <Text style={styles.commentContent}>{comment.content}</Text>
                    <Text style={styles.commentDate}>
                        {new Date(comment.createdAt).toLocaleDateString()}{' '}
                        {new Date(comment.createdAt).toLocaleTimeString()}
                    </Text>
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
    buttonRow: {
        flexDirection: 'row',
        gap: 8,
        marginTop: 6,
    },
    actionButton: {
        paddingVertical: 6,
        paddingHorizontal: 12,
        borderRadius: 16,
        alignItems: 'center',
    },
    actionButtonText: {
        color: '#fff',
        fontWeight: '600',
    },

});

export default CommentCard;
