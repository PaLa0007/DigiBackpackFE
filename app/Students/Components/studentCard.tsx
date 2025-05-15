import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Student } from '../../../src/api/students';

type Props = {
  student: Student;
  onManage?: () => void;
};

const StudentCard: React.FC<Props> = ({ student, onManage }) => {
  return (
    <View style={styles.card}>
      <View style={styles.details}>
        <Text style={styles.name}>{student.firstName} {student.lastName}</Text>
        <Text style={styles.email}>{student.email}</Text>
        <Text style={styles.meta}>Grade {student.gradeLevel} | {student.parentName} ({student.parentPhone})</Text>
      </View>
      <TouchableOpacity style={styles.manageButton} onPress={onManage}>
        <Text style={styles.manageButtonText}>Manage</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  card: { backgroundColor: '#E0F7FA', padding: 16, borderRadius: 8, marginBottom: 12, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  details: { flex: 1 },
  name: { fontWeight: 'bold', fontSize: 16, color: '#124E57' },
  email: { fontSize: 14, color: '#15808D' },
  meta: { fontSize: 12, color: '#777' },
  manageButton: { backgroundColor: '#F15A22', paddingVertical: 6, paddingHorizontal: 12, borderRadius: 6 },
  manageButtonText: { color: '#fff', fontWeight: 'bold' },
});

export default StudentCard;