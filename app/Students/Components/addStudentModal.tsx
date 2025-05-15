import React, { useState } from 'react';
import { Button, Modal, StyleSheet, Text, TextInput, View } from 'react-native';
import { CreateStudentPayload, registerStudent } from '../../../src/api/students';

interface AddStudentModalProps {
  isVisible: boolean;
  onClose: () => void;
  onSubmit: (created: any) => void;
  schoolId: number;
}

const AddStudentModal: React.FC<AddStudentModalProps> = ({ isVisible, onClose, onSubmit, schoolId }) => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    firstName: '',
    lastName: '',
    gradeLevel: '',
    parentName: '',
    parentPhone: '',
  });

  const handleChange = (field: keyof typeof formData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async () => {
    if (!schoolId) {
      alert('Missing school ID.');
      return;
    }

    try {
      const payload: CreateStudentPayload = {
        ...formData,
        schoolId,
      };
      const created = await registerStudent(payload);
      alert('Student added successfully!');
      onSubmit(created);
      onClose();
    } catch (err) {
      alert('Failed to add student.');
    }
  };

  return (
    <Modal visible={isVisible} animationType="slide" transparent>
      <View style={styles.overlay}>
        <View style={styles.modal}>
          <Text style={styles.title}>Add Student</Text>
          {Object.keys(formData).map((field) => (
            <TextInput
              key={field}
              placeholder={field}
              value={formData[field as keyof typeof formData]}
              onChangeText={(text) => handleChange(field as keyof typeof formData, text)}
              style={styles.input}
            />
          ))}
          <Button title="Add Student" onPress={handleSubmit} color="#15808D" />
          <View style={{ height: 10 }} />
          <Button title="Cancel" onPress={onClose} color="#F15A22" />
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', alignItems: 'center' },
  modal: { backgroundColor: '#fff', width: '90%', padding: 20, borderRadius: 12 },
  title: { fontSize: 20, fontWeight: 'bold', marginBottom: 16, textAlign: 'center', color: '#124E57' },
  input: { borderWidth: 1, borderColor: '#ccc', padding: 10, borderRadius: 8, marginBottom: 12 },
});

export default AddStudentModal;