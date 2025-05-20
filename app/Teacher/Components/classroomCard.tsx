import { useRouter } from 'expo-router';
import React from 'react';
import { Button, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Classroom } from '../../../src/api/classrooms';

interface Props {
  classroom: Classroom;
  onEdit: () => void;
  onDelete: () => void;
}

const ClassroomCard: React.FC<Props> = ({ classroom, onEdit, onDelete }) => {
  const router = useRouter();

  return (
    <View style={styles.card}>
      <TouchableOpacity
        style={{ flex: 1 }}
        onPress={() =>
          router.push({
            pathname: '/Teacher/classrooms/[id]',
            params: { id: classroom.id.toString() },
          })
        }
      >
        <Text style={styles.classroomName}>{classroom.name}</Text>
        <Text style={styles.classroomDetails}>Grade {classroom.grade}</Text>
      </TouchableOpacity>

      <View style={styles.cardActions}>
        <Button title="Edit" onPress={onEdit} color="#15808D" />
        <View style={{ width: 8 }} />
        <Button title="Delete" onPress={onDelete} color="#F15A22" />
      </View>
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
  },
  classroomName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#15808D',
  },
  classroomDetails: {
    fontSize: 14,
    color: '#777',
  },
  cardActions: {
    flexDirection: 'row',
    gap: 8,
  },
});

export default ClassroomCard;
