import React, { useEffect, useState } from 'react';
import { Button, Modal, StyleSheet, Text, TextInput, View } from 'react-native';
import { ClassroomPayload } from '../../../src/api/classrooms';

interface Props {
  isVisible: boolean;
  onClose: () => void;
  onSubmit: (data: ClassroomPayload) => void;
  initialData: ClassroomPayload;
}

const EditClassroomModal: React.FC<Props> = ({ isVisible, onClose, onSubmit, initialData }) => {
  const [formData, setFormData] = useState<ClassroomPayload>(initialData);

  useEffect(() => {
    setFormData(initialData);
  }, [initialData]);

  const handleChange = (field: keyof ClassroomPayload, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  return (
    <Modal visible={isVisible} transparent animationType="slide">
      <View style={styles.overlay}>
        <View style={styles.modal}>
          <Text style={styles.title}>Edit Classroom</Text>
          <TextInput
            placeholder="Classroom Name"
            value={formData.name}
            onChangeText={(text) => handleChange('name', text)}
            style={styles.input}
          />
          <TextInput
          
            value={formData.grade}
            onChangeText={(text) =>
              handleChange('grade', text.toUpperCase())
            }
            placeholder="Grade - e.g., 4A"
            style={styles.input}
          />

          <Button title="Save Changes" onPress={() => onSubmit(formData)} color="#15808D" />
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
});

export default EditClassroomModal;
