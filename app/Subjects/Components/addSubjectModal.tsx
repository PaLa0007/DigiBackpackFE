import React, { useState } from 'react';
import { Button, Modal, StyleSheet, Text, TextInput, View } from 'react-native';

import { createSubject } from '../../../src/api/subjects';

type Props = {
  visible: boolean;
  onClose: () => void;
  onSaved: () => void;
  schoolId: number;
};

const AddSubjectModal: React.FC<Props> = ({ visible, onClose, onSaved, schoolId }) => {
  const [name, setName] = useState('');

  const handleSubmit = async () => {
    if (!name.trim()) return;

    await createSubject({ name: name.trim(), schoolId });
    setName('');
    onSaved();
    onClose();
  };

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <View style={styles.overlay}>
        <View style={styles.modal}>
          <Text style={styles.title}>Add New Subject</Text>

          <TextInput
            placeholder="Subject name"
            value={name}
            onChangeText={setName}
            style={styles.input}
          />

          <Button
            title="Save"
            onPress={handleSubmit}
            color="#15808D"
            disabled={!name.trim()}
          />
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
    marginBottom: 16,
  },
});

export default AddSubjectModal;
