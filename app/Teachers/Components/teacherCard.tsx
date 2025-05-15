import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Teacher } from '../../../src/api/teachers';

type Props = {
  teacher: Teacher;
  onManage?: () => void;
};

const TeacherCard: React.FC<Props> = ({ teacher, onManage }) => {
  return (
    <View style={styles.card}>
      <View style={styles.details}>
        <Text style={styles.name}>
          {teacher.firstName} {teacher.lastName}
        </Text>
        <Text style={styles.email}>{teacher.email}</Text>
        <Text style={styles.meta}>{teacher.subjectSpecialization} | {teacher.phoneNumber}</Text>
      </View>

      <TouchableOpacity style={styles.manageButton} onPress={onManage}>
        <Text style={styles.manageButtonText}>Manage</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#E0F7FA',
    padding: 16,
    borderRadius: 8,
    marginBottom: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 3,
    shadowOffset: { width: 0, height: 1 },
    elevation: 3,
  },
  details: {
    flex: 1,
    gap: 4,
  },
  name: {
    fontWeight: 'bold',
    fontSize: 16,
    color: '#124E57',
  },
  email: {
    fontSize: 14,
    color: '#15808D',
  },
  meta: {
    fontSize: 12,
    color: '#777',
  },
  manageButton: {
    backgroundColor: '#F15A22',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 6,
  },
  manageButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});

export default TeacherCard;
