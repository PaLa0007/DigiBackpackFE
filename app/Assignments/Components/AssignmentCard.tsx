import { useRouter } from 'expo-router';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { AssignmentDto } from '../../../src/api/assignments';

type Props = {
  assignment: AssignmentDto;
  onEdit?: () => void;
  onDelete?: () => void;
};

const AssignmentCard: React.FC<Props> = ({ assignment, onEdit, onDelete }) => {
  const router = useRouter();

  return (
    <View style={styles.card}>
      <TouchableOpacity
        onPress={() =>
          router.push({
            pathname: '/Assignments/[id]',
            params: { id: assignment.id.toString() },
          } as any)
        }
      >
        <View style={styles.header}>
          <Text style={styles.title}>{assignment.title}</Text>
          <Text style={styles.dueDate}>Due: {assignment.dueDate}</Text>
        </View>

        <Text style={styles.description}>{assignment.description}</Text>
      </TouchableOpacity>

      {(onEdit || onDelete) && (
        <View style={styles.actions}>
          {onEdit && (
            <TouchableOpacity onPress={onEdit} style={styles.actionButton}>
              <Text style={styles.actionText}>✏️ Edit</Text>
            </TouchableOpacity>
          )}
          {onDelete && (
            <TouchableOpacity onPress={onDelete} style={styles.actionButton}>
              <Text style={styles.actionText}>🗑️ Delete</Text>
            </TouchableOpacity>
          )}
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    borderColor: '#E0E0E0',
    borderWidth: 1,
    shadowColor: '#000',
    shadowOpacity: 0.04,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: '#124E57',
    flexShrink: 1,
  },
  dueDate: {
    fontSize: 12,
    color: '#15808D',
    fontWeight: '500',
  },
  description: {
    fontSize: 14,
    color: '#444',
    lineHeight: 20,
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: 12,
    gap: 16,
  },
  actionButton: {
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  actionText: {
    fontSize: 14,
    color: '#124E57',
    fontWeight: '600',
  },
});

export default AssignmentCard;
