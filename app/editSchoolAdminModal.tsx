import React, { useEffect, useState } from 'react';
import { Modal, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { updateSchoolAdmin } from '../src/api/users';

type EditSchoolAdminModalProps = {
    admin: {
        id: number;
        username: string;
        email: string;
        firstName: string;
        lastName: string;
    };
    isVisible: boolean;
    onClose: () => void;
    onSave: () => void;
};

const EditSchoolAdminModal: React.FC<EditSchoolAdminModalProps> = ({
    admin,
    isVisible,
    onClose,
    onSave,
}) => {
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        firstName: '',
        lastName: '',
    });

    // Pre-fill when admin changes
    useEffect(() => {
        if (admin) {
            setFormData({
                username: admin.username,
                email: admin.email,
                firstName: admin.firstName,
                lastName: admin.lastName,
            });
        }
    }, [admin]);

    const handleChange = (field: string, value: string) => {
        setFormData({ ...formData, [field]: value });
    };

    const handleSubmit = async () => {
        try {
            await updateSchoolAdmin(admin.id, formData);
            alert('Admin updated successfully!');
            onSave(); // close & refresh
        } catch (error) {
            console.error('Failed to update admin:', error);
            alert('Failed to update admin.');
        }
    };

    return (
        <Modal visible={isVisible} animationType="slide" transparent>
            <View style={styles.modalContainer}>
                <Text style={styles.modalHeader}>Edit School Admin</Text>

                <TextInput
                    style={styles.input}
                    placeholder="Username"
                    value={formData.username}
                    onChangeText={(text) => handleChange('username', text)}
                />
                <TextInput
                    style={styles.input}
                    placeholder="Email"
                    value={formData.email}
                    onChangeText={(text) => handleChange('email', text)}
                />
                <TextInput
                    style={styles.input}
                    placeholder="First Name"
                    value={formData.firstName}
                    onChangeText={(text) => handleChange('firstName', text)}
                />
                <TextInput
                    style={styles.input}
                    placeholder="Last Name"
                    value={formData.lastName}
                    onChangeText={(text) => handleChange('lastName', text)}
                />

                <View style={styles.buttonRow}>
                    <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
                        <Text style={styles.buttonText}>Save Changes</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.cancelButton} onPress={onClose}>
                        <Text style={styles.buttonText}>Cancel</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </Modal>
    );
};

const styles = StyleSheet.create({
    modalContainer: {
        backgroundColor: '#fff',
        padding: 20,
        margin: 20,
        borderRadius: 12,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
        elevation: 5,
    },
    modalHeader: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 16,
        textAlign: 'center',
        color: '#124E57',
    },
    input: {
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 8,
        padding: 10,
        marginBottom: 12,
    },
    buttonRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    submitButton: {
        backgroundColor: '#15808D',
        padding: 12,
        borderRadius: 8,
        flex: 1,
        marginRight: 8,
        alignItems: 'center',
    },
    cancelButton: {
        backgroundColor: '#F15A22',
        padding: 12,
        borderRadius: 8,
        flex: 1,
        marginLeft: 8,
        alignItems: 'center',
    },
    buttonText: {
        color: '#fff',
        fontWeight: 'bold',
    },
});

export default EditSchoolAdminModal;
