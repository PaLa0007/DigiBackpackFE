import * as DocumentPicker from 'expo-document-picker';
import React, { useEffect, useState } from 'react';
import { Button, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { deleteSubmission, downloadSubmissionFile, fetchSubmissions, SubmissionDto, uploadSubmission } from '../../../src/api/submissions';
import { useAuth } from '../../../src/store/auth';

type Props = {
    assignmentId: number;
    onUploaded: () => void;
    hideRevokeButton?: boolean;
};

const SubmissionUploader: React.FC<Props> = ({ assignmentId, onUploaded, hideRevokeButton }) => {
    const user = useAuth((state) => state.user);
    const [description, setDescription] = useState('');
    const [selectedFiles, setSelectedFiles] = useState<{ uri: string; name: string; type: string }[]>([]);
    const [existingSubmission, setExistingSubmission] = useState<SubmissionDto | null>(null);

    const loadSubmissionStatus = async () => {
        if (!user) return;
        const submissions = await fetchSubmissions(assignmentId);
        const existing = submissions.find(sub => sub.studentId === user.id);
        setExistingSubmission(existing ?? null);
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
            await loadSubmissionStatus();
            onUploaded();
        } catch (error) {
            console.error('Upload error:', error);
        }
    };

    const handleRevoke = async () => {
        if (existingSubmission) {
            try {
                await deleteSubmission(existingSubmission.id);
                await loadSubmissionStatus();
                onUploaded();
            } catch (error) {
                console.error('Revoke error:', error);
            }
        }
    };

    if (!user) return null;

    if (existingSubmission) {
        // ✅ Minimal inline submission summary for feed
        return (
            <View style={styles.submissionSummary}>
                <Text style={styles.infoText}>You have already submitted for this assignment.</Text>
                <Text style={styles.submissionDate}>
                    Submitted on: {new Date(existingSubmission.submittedAt).toLocaleDateString()}
                </Text>
                {existingSubmission.files?.map(file => (
                    <View key={file.id} style={styles.fileRow}>
                        <Text style={styles.fileName}>{file.fileName}</Text>
                        <TouchableOpacity
                            style={styles.downloadButton}
                            onPress={() => downloadSubmissionFile(existingSubmission.id, file.id, file.fileName)}
                        >
                            <Text style={styles.downloadButtonText}>Download</Text>
                        </TouchableOpacity>
                    </View>
                ))}
                {!hideRevokeButton && (
                    <Button title="Revoke Submission" color="#F15A22" onPress={handleRevoke} />
                )}
            </View>
        );
    }

    return (
        <View style={styles.container}>
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
    );
};

const styles = StyleSheet.create({
    container: { marginTop: 8 },
    submissionSummary: {
        backgroundColor: '#F9F9F9',
        padding: 8,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: '#E0E0E0',
        marginTop: 8,
    },
    infoText: {
        color: '#124E57',
        fontWeight: '600',
        marginBottom: 4,
    },
    submissionDate: {
        fontSize: 12,
        color: '#555',
        marginBottom: 6,
    },
    fileRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 4,
    },
    fileName: {
        flex: 1,
        color: '#124E57',
        fontSize: 14,
    },
    downloadButton: {
        backgroundColor: '#15808D',
        paddingVertical: 4,
        paddingHorizontal: 8,
        borderRadius: 6,
    },
    downloadButtonText: {
        color: '#fff',
        fontSize: 12,
    },
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
});

export default SubmissionUploader;
