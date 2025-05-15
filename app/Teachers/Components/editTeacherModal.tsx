import React, { useState } from 'react';
import { Button, Modal, StyleSheet, Text, TextInput, View } from 'react-native';
import { Teacher, updateTeacher } from '../../../src/api/teachers';

type Props = {
  teacher: Teacher;
  isVisible: boolean;
  onClose: () => void;
  onSave: () => void;
};

const EditTeacherModal: React.FC<Props> = ({ teacher, isVisible, onClose, onSave }) => {
  const [formData, setFormData] = useState({
    firstName: teacher.firstName,
    lastName: teacher.lastName,
    email: teacher.email,
    hireDate: teacher.hireDate,
    subjectSpecialization: teacher.subjectSpecialization,
    phoneNumber: teacher.phoneNumber,
  });

  const handleChange = (field: keyof typeof formData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async () => {
    try {
      await updateTeacher(teacher.id, formData);
      alert('Teacher updated successfully!');
      onSave();
      onClose();
    } catch (err) {
      alert('Failed to update teacher.');
    }
  };

  return (
    <Modal visible={isVisible} animationType="slide" transparent>
      <View style={styles.overlay}>
        <View style={styles.modal}>
          <Text style={styles.title}>Edit Teacher</Text>
          {['firstName', 'lastName', 'email', 'hireDate', 'subjectSpecialization', 'phoneNumber'].map((field) => (
            <TextInput
              key={field}
              placeholder={field}
              value={formData[field as keyof typeof formData]}
              onChangeText={(text) => handleChange(field as keyof typeof formData, text)}
              style={styles.input}
            />
          ))}

          <Button title="Save Changes" onPress={handleSubmit} color="#15808D" />
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
    backgroundColor: 'rgba(0,0,0,0.5)',
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
    color: '#124E57',
    marginBottom: 12,
    textAlign: 'center',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 10,
    marginBottom: 10,
  },
});

export default EditTeacherModal;
