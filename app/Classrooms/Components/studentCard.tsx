import React from 'react';
import { Button, StyleSheet, Text, View } from 'react-native';
import { Student } from '../../../src/api/students';

export type StudentCardProps = {
  student: Student;
  primaryActionLabel: string;
  onPrimaryAction: () => void;
  secondaryActionLabel?: string;
  onSecondaryAction?: () => void;
  variant?: 'add' | 'manage';
};

// ✅ THIS LINE IS KEY
const StudentCard: React.FC<StudentCardProps> = (props) => {
  const {
    student,
    primaryActionLabel,
    onPrimaryAction,
    secondaryActionLabel,
    onSecondaryAction,
    variant = 'manage',
  } = props;

  return (
    <View style={styles.card}>
      <View style={{ flex: 1 }}>
        <Text style={styles.studentName}>
          {student.firstName} {student.lastName}
        </Text>
        <Text style={styles.studentDetails}>Grade {student.gradeLevel}</Text>
        <Text style={styles.studentDetails}>Parent: {student.parentName}</Text>
      </View>

      <View style={styles.cardActions}>
        <Button
          title={primaryActionLabel}
          onPress={onPrimaryAction}
          color={variant === 'add' ? '#15808D' : '#D32F2F'}
        />
        {secondaryActionLabel && onSecondaryAction && (
          <>
            <View style={{ width: 8 }} />
            <Button
              title={secondaryActionLabel}
              onPress={onSecondaryAction}
              color="#15808D"
            />
          </>
        )}
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
  studentName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#15808D',
  },
  studentDetails: {
    fontSize: 14,
    color: '#777',
  },
  cardActions: {
    flexDirection: 'row',
    gap: 8,
  },
});

export default StudentCard;
