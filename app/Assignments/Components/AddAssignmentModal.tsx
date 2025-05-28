import { Picker } from '@react-native-picker/picker';
import React, { useState } from 'react';
import { Button, Modal, StyleSheet, Text, TextInput, View } from 'react-native';
import { createAssignment } from '../../../src/api/assignments';
import { useAuth } from '../../../src/store/auth';

type Props = {
    visible: boolean;
    onClose: () => void;
    onAdded: () => void;
    classroomOptions: { id: number; name: string }[];
    classroomId?: number; // Optional, used when modal is opened from classroom feed
};

const AddAssignmentModal: React.FC<Props> = ({
    visible,
    onClose,
    onAdded,
    classroomOptions,
    classroomId,
}) => {
    const user = useAuth((state) => state.user);
    if (!user) return null;

    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [dueDate, setDueDate] = useState('');
    const [selectedClassroomId, setSelectedClassroomId] = useState<number | null>(
        classroomId ?? null
    );

    const handleSubmit = async () => {
        if (!selectedClassroomId) return;

        await createAssignment({
            title,
            description,
            dueDate,
            createdById: user.id,
            classroomId: selectedClassroomId,
        });

        onClose();
        onAdded();
    };

    return (
        <Modal visible={visible} transparent animationType="slide">
            <View style={styles.overlay}>
                <View style={styles.modal}>
                    <Text style={styles.title}>Add Assignment</Text>

                    <TextInput
                        placeholder="Title"
                        value={title}
                        onChangeText={setTitle}
                        style={styles.input}
                    />
                    <TextInput
                        placeholder="Description"
                        value={description}
                        onChangeText={setDescription}
                        style={styles.input}
                    />
                    <TextInput
                        placeholder="Due Date (YYYY-MM-DD)"
                        value={dueDate}
                        onChangeText={setDueDate}
                        style={styles.input}
                    />

                    {!classroomId && (
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

                    <Button title="Submit" onPress={handleSubmit} color="#15808D" />
                    <View style={{ height: 10 }} />
                    <Button title="Cancel" onPress={onClose} color="#F15A22" />
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
});

export default AddAssignmentModal;
