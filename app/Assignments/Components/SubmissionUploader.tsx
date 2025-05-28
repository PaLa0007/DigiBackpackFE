import * as DocumentPicker from 'expo-document-picker';
import React from 'react';
import { Button, Text, View } from 'react-native';
import { uploadSubmission } from '../../../src/api/submissions';
import { useAuth } from '../../../src/store/auth';

type Props = {
    assignmentId: number;
    onUploaded: () => void;
};

const SubmissionUploader: React.FC<Props> = ({ assignmentId, onUploaded }) => {
    const user = useAuth((state) => state.user);
    if (!user) return null;

    const handlePickAndUpload = async () => {
        const result = await DocumentPicker.getDocumentAsync({
            copyToCacheDirectory: true,
            multiple: true, // ✅ Allow multiple file selection
        });

        if (result.assets && result.assets.length > 0) {
            for (const file of result.assets) {
                await uploadSubmission(assignmentId, user.id, {
                    uri: file.uri,
                    name: file.name,
                    type: file.mimeType || 'application/octet-stream',
                });
            }

            onUploaded();
        }
    };

    return (
        <View>
            <Button title="Upload Submission(s)" onPress={handlePickAndUpload} />
            <Text style={{ fontSize: 12, marginTop: 8, color: '#555' }}>
                You can select multiple files at once.
            </Text>
        </View>
    );
};

export default SubmissionUploader;
