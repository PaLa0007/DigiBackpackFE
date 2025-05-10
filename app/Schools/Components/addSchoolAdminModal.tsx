import React, { useState } from 'react';
import { Button, Modal, StyleSheet, Text, TextInput, View } from 'react-native';
import { registerSchoolAdmin } from '../../../src/api/users';


type AddSchoolAdminModalProps = {
    schoolId: number;
    isVisible: boolean;
    onClose: () => void;
    onSave: () => void;
};

const AddSchoolAdminModal: React.FC<AddSchoolAdminModalProps> = ({
    schoolId,
    isVisible,
    onClose,
    onSave,
}) => {
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        firstName: '',
        lastName: '',
        password: '',
    });

    const handleChange = (field: string, value: string) => {
        setFormData((prev) => ({ ...prev, [field]: value }));
    };

    const handleSubmit = async () => {
        try {
            await registerSchoolAdmin(schoolId, formData);
            alert('Admin registered successfully!');
            onSave();
            onClose();
        } catch (error) {
            console.error(error);
            alert('Failed to register admin.');
        }
    };

    return (
        <Modal visible={isVisible} animationType="fade" transparent>
            <View style={styles.overlay}>
                <View style={styles.modalContainer}>
                    <Text style={styles.modalTitle}>Register School Admin</Text>
                    {['username', 'email', 'firstName', 'lastName', 'password'].map((field) => (
                        <TextInput
                            key={field}
                            placeholder={field.charAt(0).toUpperCase() + field.slice(1)}
                            value={formData[field as keyof typeof formData]}
                            onChangeText={(text) => handleChange(field, text)}
                            style={styles.input}
                            secureTextEntry={field === 'password'}
                        />
                    ))}
                    <Button title="Register" color="#15808D" onPress={handleSubmit} />
                    <View style={{ height: 10 }} />
                    <Button title="Cancel" color="#F15A22" onPress={onClose} />
                </View>
            </View>
        </Modal>
    );
};

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.5)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalContainer: {
        backgroundColor: '#fff',
        width: '90%',
        padding: 20,
        borderRadius: 12,
        elevation: 5,
    },
    modalTitle: {
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
});

export default AddSchoolAdminModal;
