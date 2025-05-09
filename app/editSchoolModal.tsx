import React, { useState } from 'react';
import { Button, Modal, StyleSheet, Text, TextInput, View } from 'react-native';
import { updateSchool } from '../src/api/schools';

type School = {
    id: number;
    name: string;
    address: string;
    city: string;
    country: string;
};

type EditSchoolModalProps = {
    school: School;
    isVisible: boolean;
    onClose: () => void;
    onSave: () => void;
};

const EditSchoolModal: React.FC<EditSchoolModalProps> = ({
    school,
    isVisible,
    onClose,
    onSave,
}) => {
    const [formData, setFormData] = useState({
        name: school.name,
        address: school.address,
        city: school.city,
        country: school.country,
    });

    const handleChange = (field: string, value: string) => {
        setFormData((prev) => ({ ...prev, [field]: value }));
    };

    const handleSubmit = async () => {
        try {
            await updateSchool(school.id, formData);
            alert('School updated successfully!');
            onSave();
            onClose();
        } catch (error) {
            console.error(error);
            alert('Failed to update school.');
        }
    };

    return (
        <Modal visible={isVisible} animationType="fade" transparent>
            <View style={styles.overlay}>
                <View style={styles.modalContainer}>
                    <Text style={styles.modalTitle}>Edit School</Text>
                    {['name', 'address', 'city', 'country'].map((field) => (
                        <TextInput
                            key={field}
                            placeholder={field.charAt(0).toUpperCase() + field.slice(1)}
                            value={formData[field as keyof typeof formData]}
                            onChangeText={(text) => handleChange(field, text)}
                            style={styles.input}
                        />
                    ))}
                    <Button title="Save Changes" color="#15808D" onPress={handleSubmit} />
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

export default EditSchoolModal;
