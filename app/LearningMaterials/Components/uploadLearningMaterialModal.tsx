import { Picker } from '@react-native-picker/picker';
import * as DocumentPicker from 'expo-document-picker';
import { DocumentPickerAsset } from 'expo-document-picker';
import React, { useState } from 'react';
import {
    ActivityIndicator,
    Button,
    Modal, Platform, StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View
} from 'react-native';

interface Props {
    visible: boolean;
    onClose: () => void;
    uploadedById: number;
    onUploadSuccess: () => void;
    classroomOptions?: { id: number; name: string }[]; // ✅ now optional
    classroomId?: number;
}

const UploadLearningMaterialModal: React.FC<Props> = ({
    visible,
    onClose,
    uploadedById,
    onUploadSuccess,
    classroomOptions,
    classroomId,
}) => {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [file, setFile] = useState<DocumentPickerAsset | null>(null);
    const [uploading, setUploading] = useState(false);
    const [selectedClassroomId, setSelectedClassroomId] = useState<number | null>(classroomId ?? null);

    const handlePickFile = async () => {
        const result = await DocumentPicker.getDocumentAsync({ type: '*/*' });
        if (!result.canceled && result.assets && result.assets.length > 0) {
            setFile(result.assets[0]);
        }
    };

const handleUpload = async () => {
    if (!file || !title || !selectedClassroomId) {
        console.error("Missing required fields");
        return;
    }

    setUploading(true);

    try {
        console.log('Preparing FormData:');
        console.log('file:', file);
        console.log('title:', title);
        console.log('description:', description);
        console.log('classroomId:', selectedClassroomId);
        console.log('uploadedById:', uploadedById);

        const formData = new FormData();

        if (Platform.OS === 'web') {
            // Fetch the file as a Blob explicitly on web
            const fileResponse = await fetch(file.uri);
            const blob = await fileResponse.blob();
            formData.append('file', blob, file.name);
        } else {
            // Use proper object on mobile
            formData.append('file', {
                uri: file.uri,
                name: file.name,
                type: file.mimeType || 'application/octet-stream',
            } as any);
        }

        formData.append('title', title);
        formData.append('description', description);
        formData.append('classroomId', selectedClassroomId.toString());
        formData.append('uploadedById', uploadedById.toString());

        // Upload using fetch (reliable across web and devices)
        const response = await fetch('http://192.168.31.100:8165/api/learning-materials/upload', {
            method: 'POST',
            body: formData,
        });

        if (!response.ok) {
            const errorText = await response.text();
            console.error('Upload failed:', errorText);
            throw new Error('Upload failed: ' + response.status);
        }

        const data = await response.json();
        console.log('Upload successful:', data);

        setTitle('');
        setDescription('');
        setFile(null);
        onUploadSuccess();
        onClose();

    } catch (error) {
        console.error('Upload error:', error);
    } finally {
        setUploading(false);
    }
};


    return (
        <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
            <View style={styles.overlay}>
                <View style={styles.modal}>
                    <Text style={styles.title}>Upload Learning Material</Text>

                    <TextInput
                        placeholder="Title"
                        value={title}
                        onChangeText={setTitle}
                        style={styles.input}
                    />
                    <TextInput
                        placeholder="Description (optional)"
                        value={description}
                        onChangeText={setDescription}
                        style={styles.input}
                    />

                    {!classroomId && classroomOptions && (
                        <View style={styles.pickerWrapper}>
                            <Text style={styles.label}>Select Classroom</Text>
                            <Picker
                                selectedValue={selectedClassroomId}
                                onValueChange={(value) => setSelectedClassroomId(value)}
                            >
                                <Picker.Item label="Choose a classroom..." value={null} />
                                {classroomOptions.map((cls) => (
                                    <Picker.Item key={cls.id} label={cls.name} value={cls.id} />
                                ))}
                            </Picker>
                        </View>
                    )}


                    <TouchableOpacity onPress={handlePickFile} style={styles.filePicker}>
                        <Text style={styles.filePickerText}>
                            {file ? `📎 ${file.name}` : '📎 Pick a file'}
                        </Text>
                    </TouchableOpacity>

                    {uploading ? (
                        <ActivityIndicator size="large" />
                    ) : (
                        <>
                            <Button
                                title="Upload"
                                onPress={handleUpload}
                                color="#15808D"
                                disabled={!file || !title || !selectedClassroomId}
                            />
                            <View style={{ height: 10 }} />
                            <Button title="Cancel" onPress={onClose} color="#F15A22" />
                        </>
                    )}
                </View>
            </View>
        </Modal>
    );
};

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0,0,0,0.4)',
    },
    modal: {
        backgroundColor: '#fff',
        width: '90%',
        padding: 20,
        borderRadius: 12,
    },
    title: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 16,
        textAlign: 'center',
        color: '#124E57',
    },
    input: {
        borderWidth: 1,
        borderColor: '#ccc',
        padding: 10,
        borderRadius: 8,
        marginBottom: 12,
    },
    pickerWrapper: {
        marginBottom: 16,
    },
    label: {
        marginBottom: 4,
        fontWeight: '500',
        color: '#333',
    },
    filePicker: {
        padding: 12,
        borderWidth: 1,
        borderColor: '#15808D',
        borderRadius: 8,
        marginBottom: 16,
        alignItems: 'center',
    },
    filePickerText: {
        color: '#15808D',
        fontWeight: '600',
    },
});

export default UploadLearningMaterialModal;
