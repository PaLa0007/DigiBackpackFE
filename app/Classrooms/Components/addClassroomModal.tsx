import { Picker } from '@react-native-picker/picker';
import React, { useEffect, useState } from 'react';
import { Button, Modal, StyleSheet, Text, TextInput, View } from 'react-native';
import { ClassroomPayload } from '../../../src/api/classrooms';
import { Subject, fetchSubjectsBySchool } from '../../../src/api/subjects';
import { Teacher, fetchTeachersBySchool } from '../../../src/api/teachers';
import { useAuth } from '../../../src/store/auth';

interface Props {
  isVisible: boolean;
  onClose: () => void;
  onSubmit: (data: ClassroomPayload) => void;
}

const AddClassroomModal: React.FC<Props> = ({ isVisible, onClose, onSubmit }) => {
  const { user } = useAuth();
  const [formData, setFormData] = useState<ClassroomPayload>({
    name: '',
    grade: '',
    subjectId: 0,
    teacherId: undefined,
  });

  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [teachers, setTeachers] = useState<Teacher[]>([]);

  // ✅ Reset form each time modal is opened
  useEffect(() => {
    if (isVisible) {
      setFormData({
        name: '',
        grade: '',
        subjectId: 0,
        teacherId: undefined,
      });
    }
  }, [isVisible]);

  useEffect(() => {
    if (user?.schoolId) {
      fetchSubjectsBySchool(user.schoolId).then(setSubjects);
      fetchTeachersBySchool(user.schoolId).then(setTeachers);
    }
  }, [user]);

  const handleChange = (field: keyof ClassroomPayload, value: string | number | undefined) => {
    setFormData((prev) => ({
      ...prev,
      [field]: field === 'grade' && typeof value === 'string' ? value.toUpperCase() : value,
    }));
  };

  const isValid = formData.name.trim() !== '' && formData.grade.trim() !== '' && formData.subjectId !== 0;

  return (
    <Modal visible={isVisible} transparent animationType="slide">
      <View style={styles.overlay}>
        <View style={styles.modal}>
          <Text style={styles.title}>Add Classroom</Text>

          <TextInput
            placeholder="Classroom Name"
            value={formData.name}
            onChangeText={(text) => handleChange('name', text)}
            style={styles.input}
          />

          <TextInput
            value={formData.grade}
            onChangeText={(text) => handleChange('grade', text)}
            placeholder="Grade - e.g., 4A"
            style={styles.input}
          />

          <Text style={styles.label}>Subject</Text>
          <Picker
            selectedValue={formData.subjectId}
            onValueChange={(value) => handleChange('subjectId', Number(value))}
          >
            <Picker.Item label="Select a subject..." value={0} />
            {subjects.map((s) => (
              <Picker.Item key={s.id} label={s.name} value={s.id} />
            ))}
          </Picker>

          <Text style={styles.label}>Teacher</Text>
          <Picker
            selectedValue={formData.teacherId ?? 0}
            onValueChange={(value) => handleChange('teacherId', Number(value) === 0 ? undefined : Number(value))}
          >
            <Picker.Item label="Select a teacher..." value={0} />
            {teachers.map((t) => (
              <Picker.Item key={t.id} label={`${t.firstName} ${t.lastName}`} value={t.id} />
            ))}
          </Picker>

          <View style={{ height: 12 }} />
          <Button title="Save" onPress={() => onSubmit(formData)} color="#15808D" disabled={!isValid} />
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
  label: {
    marginTop: 12,
    marginBottom: 4,
    fontWeight: '600',
    color: '#333',
  },
});

export default AddClassroomModal;
