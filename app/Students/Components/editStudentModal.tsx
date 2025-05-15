import React, { useState } from 'react';
import { Button, Modal, StyleSheet, Text, TextInput, View } from 'react-native';
import { Student, updateStudent } from '../../../src/api/students';

type Props = {
  student: Student;
  isVisible: boolean;
  onClose: () => void;
  onSave: () => void;
};

const EditStudentModal: React.FC<Props> = ({ student, isVisible, onClose, onSave }) => {
  const [formData, setFormData] = useState({
    username: student.username,
    firstName: student.firstName,
    lastName: student.lastName,
    email: student.email,
    gradeLevel: student.gradeLevel,
    parentName: student.parentName,
    parentPhone: student.parentPhone,
  });

  const handleChange = (field: keyof typeof formData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async () => {
    try {
      await updateStudent(student.id, formData);
      alert('Student updated successfully!');
      onSave();
      onClose();
    } catch (err) {
      alert('Failed to update student.');
    }
  };

  return (
    <Modal visible={isVisible} animationType="slide" transparent>
      <View style={styles.overlay}>
        <View style={styles.modal}>
          <Text style={styles.title}>Edit Student</Text>
          {Object.keys(formData).map((field) => (
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
  overlay: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0,0,0,0.5)' },
  modal: { backgroundColor: '#fff', width: '90%', padding: 20, borderRadius: 12 },
  title: { fontSize: 20, fontWeight: 'bold', color: '#124E57', marginBottom: 12, textAlign: 'center' },
  input: { borderWidth: 1, borderColor: '#ccc', borderRadius: 8, padding: 10, marginBottom: 10 },
});

export default EditStudentModal;