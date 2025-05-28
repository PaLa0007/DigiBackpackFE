import React, { useEffect, useState } from 'react';
import { Button, Modal, StyleSheet, Text, TextInput, View } from 'react-native';
import { AssignmentDto, updateAssignment } from '../../../src/api/assignments';

type Props = {
  visible: boolean;
  assignment: AssignmentDto;
  onClose: () => void;
  onUpdated: () => void;
};

const EditAssignmentModal: React.FC<Props> = ({ visible, assignment, onClose, onUpdated }) => {
  const [title, setTitle] = useState(assignment.title);
  const [description, setDescription] = useState(assignment.description);
  const [dueDate, setDueDate] = useState(assignment.dueDate);

  useEffect(() => {
    setTitle(assignment.title);
    setDescription(assignment.description);
    setDueDate(assignment.dueDate);
  }, [assignment]);

  const handleSubmit = async () => {
    await updateAssignment(assignment.id, {
      title,
      description,
      dueDate,
      createdById: assignment.createdById,
      classroomId: assignment.classroomId,
    });
    onClose();
    onUpdated();
  };

  return (
    <Modal visible={visible} transparent animationType="slide">
      <View style={styles.overlay}>
        <View style={styles.modal}>
          <Text style={styles.title}>Edit Assignment</Text>

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

          <Button title="Update" onPress={handleSubmit} color="#15808D" />
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

export default EditAssignmentModal;
