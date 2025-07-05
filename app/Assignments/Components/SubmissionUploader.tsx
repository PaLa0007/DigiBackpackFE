import * as DocumentPicker from 'expo-document-picker';
import React, { useEffect, useState } from 'react';
import { Button, StyleSheet, Text, TextInput, View } from 'react-native';
import { deleteSubmission, fetchSubmissions, uploadSubmission } from '../../../src/api/submissions';
import { useAuth } from '../../../src/store/auth';

type Props = {
    assignmentId: number;
    onUploaded: () => void;
};

const SubmissionUploader: React.FC<Props> = ({ assignmentId, onUploaded }) => {
    const user = useAuth((state) => state.user);
    const [description, setDescription] = useState('');
    const [selectedFiles, setSelectedFiles] = useState<{ uri: string; name: string; type: string }[]>([]);
    const [existingSubmissionId, setExistingSubmissionId] = useState<number | null>(null);

    const loadSubmissionStatus = async () => {
        if (!user) return;
        const submissions = await fetchSubmissions(assignmentId);
        const existing = submissions.find(sub => sub.studentId === user.id);
        if (existing) {
            setExistingSubmissionId(existing.id);
        } else {
            setExistingSubmissionId(null);
        }
    };

    useEffect(() => {
        loadSubmissionStatus();
    }, []);

    const handlePickFiles = async () => {
        const result = await DocumentPicker.getDocumentAsync({
            copyToCacheDirectory: true,
            multiple: true,
        });

        if (!result.canceled && result.assets && result.assets.length > 0) {
            const files = result.assets.map(file => ({
                uri: file.uri,
                name: file.name,
                type: file.mimeType || 'application/octet-stream',
            }));
            setSelectedFiles(files);
        }
    };

    const handleSubmit = async () => {
        if (!user) return;
        try {
            await uploadSubmission(assignmentId, user.id, description || undefined, selectedFiles);
            setDescription('');
            setSelectedFiles([]);
            await loadSubmissionStatus(); // refresh internal submission state
            onUploaded(); // notify parent to refresh submission list
        } catch (error) {
            console.error('Upload error:', error);
        }
    };

    const handleRevoke = async () => {
        if (existingSubmissionId) {
            try {
                await deleteSubmission(existingSubmissionId);
                await loadSubmissionStatus(); // refresh internal submission state
                onUploaded(); // notify parent to refresh submission list
            } catch (error) {
                console.error('Revoke error:', error);
            }
        }
    };

    if (!user) return null;

    return (
        <View style={styles.container}>
            {existingSubmissionId ? (
                <View>
                    <Text style={styles.infoText}>You have already submitted for this assignment.</Text>
                    <Button title="Revoke Submission" color="#F15A22" onPress={handleRevoke} />
                </View>
            ) : (
                <View>
                    <TextInput
                        placeholder="Optional description..."
                        value={description}
                        onChangeText={setDescription}
                        style={styles.input}
                    />
                    <Button title="Pick Files" onPress={handlePickFiles} />
                    <Text style={styles.selectedFiles}>
                        {selectedFiles.length > 0
                            ? `Selected files: ${selectedFiles.map(file => file.name).join(', ')}`
                            : 'No files selected'}
                    </Text>
                    <View style={{ height: 8 }} />
                    <Button
                        title="Submit Submission"
                        onPress={handleSubmit}
                        disabled={selectedFiles.length === 0 && description.trim() === ''}
                    />
                </View>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: { marginTop: 16 },
    input: {
        borderWidth: 1,
        borderColor: '#ccc',
        padding: 8,
        borderRadius: 8,
        marginBottom: 8,
    },
    selectedFiles: {
        fontSize: 12,
        color: '#555',
        marginTop: 8,
    },
    infoText: {
        color: '#555',
        marginBottom: 8,
    },
});

export default SubmissionUploader;
