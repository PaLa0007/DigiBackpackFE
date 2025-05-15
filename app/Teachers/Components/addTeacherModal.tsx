import DateTimePicker from '@react-native-community/datetimepicker';
import { format } from 'date-fns';
import React, { useState } from 'react';
import { Button, Modal, Platform, StyleSheet, Text, TextInput, View } from 'react-native';
import { CreateTeacherPayload, registerTeacher } from '../../../src/api/teachers';
import { useAuth } from '../../../src/store/auth';


interface AddTeacherModalProps {
    isVisible: boolean;
    onClose: () => void;
    onSubmit: (created: any) => void;
    schoolId: number;
}

const AddTeacherModal: React.FC<AddTeacherModalProps> = ({ isVisible, onClose, onSubmit }) => {
    const user = useAuth((state) => state.user);
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        password: '',
        firstName: '',
        lastName: '',
        hireDate: '',
        subjectSpecialization: '',
        phoneNumber: '',
    });
    const [hireDate, setHireDate] = useState<Date>(new Date());
    const [showDatePicker, setShowDatePicker] = useState(false);

    const handleChange = (field: keyof typeof formData, value: string) => {
        setFormData((prev) => ({ ...prev, [field]: value }));
    };

    const handleDateChange = (_event: any, selectedDate?: Date) => {
        setShowDatePicker(false);
        if (selectedDate) setHireDate(selectedDate);
    };

    const handleSubmit = async () => {
        if (!user?.schoolId) {
            alert('Missing school ID for teacher registration.');
            return;
        }

        try {
            const formattedData: CreateTeacherPayload = {
                ...formData,
                hireDate: format(hireDate, 'dd.MM.yyyy'),
                schoolId: user.schoolId, // ✅ FIXED: uses top-level schoolId
            };

            console.log('Registering teacher with data:', formattedData);
            const created = await registerTeacher(formattedData);
            alert('Teacher added successfully!');
            onSubmit(created);
            onClose();
        } catch (err) {
            console.error('Failed to register teacher:', err);
            alert('Failed to add teacher.');
        }
    };

    return (
        <Modal visible={isVisible} animationType="slide" transparent>
            <View style={styles.overlay}>
                <View style={styles.modal}>
                    <Text style={styles.title}>Add Teacher</Text>
                    {['username', 'email', 'password', 'firstName', 'lastName', 'subjectSpecialization', 'phoneNumber'].map((field) => (
                        <TextInput
                            key={field}
                            placeholder={field}
                            value={String(formData[field as keyof typeof formData])}
                            onChangeText={(text) => handleChange(field as keyof typeof formData, text)}
                            secureTextEntry={field === 'password'}
                            style={styles.input}
                        />
                    ))}

                    <TextInput
                        placeholder="Hire Date (dd/MM/yyyy)"
                        value={format(hireDate, 'dd/MM/yyyy')}
                        onFocus={() => setShowDatePicker(true)}
                        style={styles.input}
                    />

                    {showDatePicker && (
                        <DateTimePicker
                            value={hireDate}
                            mode="date"
                            display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                            onChange={handleDateChange}
                        />
                    )}

                    <Button title="Add Teacher" onPress={handleSubmit} color="#15808D" />
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
        backgroundColor: 'rgba(0,0,0,0.5)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    modal: {
        backgroundColor: '#fff',
        width: '90%',
        padding: 20,
        borderRadius: 12,
        elevation: 5,
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
});

export default AddTeacherModal;
