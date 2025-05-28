import { useQuery } from '@tanstack/react-query';
import { useLocalSearchParams } from 'expo-router';
import React from 'react';
import {
    ActivityIndicator,
    StyleSheet,
    Text,
    View,
} from 'react-native';
import { fetchAssignmentById } from '../../src/api/assignments';
import { useLogout } from '../../src/hooks/useLogout';
import { useAuth } from '../../src/store/auth';
import Sidebar from '../Shared/Sidebar';
import SubmissionList from './Components/SubmissionList';
import SubmissionUploader from './Components/SubmissionUploader';

export default function AssignmentDetailsScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const assignmentId = Number(id);
  const { user } = useAuth();
  const logout = useLogout();

  const { data: assignment, isLoading, error } = useQuery({
    queryKey: ['assignment-details', assignmentId],
    queryFn: () => fetchAssignmentById(assignmentId),
    enabled: !!assignmentId,
  });

  if (isLoading) {
    return (
      <View style={styles.wrapper}>
        <Sidebar onLogout={logout} />
        <View style={styles.centered}>
          <ActivityIndicator size="large" color="#F69521" />
        </View>
      </View>
    );
  }

  if (error || !assignment) {
    return (
      <View style={styles.wrapper}>
        <Sidebar onLogout={logout} />
        <View style={styles.centered}>
          <Text style={styles.error}>Failed to load assignment.</Text>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.wrapper}>
      <Sidebar onLogout={logout} />
      <View style={styles.mainContent}>
        <Text style={styles.title}>{assignment.title}</Text>
        <Text style={styles.description}>{assignment.description}</Text>
        <Text style={styles.dueDate}>Due: {assignment.dueDate}</Text>

        {user?.role === 'STUDENT' && (
          <SubmissionUploader assignmentId={assignmentId} onUploaded={() => {}} />
        )}

        <Text style={styles.submissionsTitle}>Submissions</Text>
        <SubmissionList assignmentId={assignmentId} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: '#F2F2F2',
  },
  mainContent: {
    flex: 1,
    padding: 16,
    backgroundColor: '#FFFFFF',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#124E57',
    marginBottom: 8,
  },
  description: {
    fontSize: 16,
    color: '#555',
    marginBottom: 6,
  },
  dueDate: {
    fontSize: 14,
    color: '#888',
    marginBottom: 16,
  },
  submissionsTitle: {
    marginTop: 20,
    fontSize: 18,
    fontWeight: 'bold',
    color: '#15808D',
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
  },
  error: {
    color: '#F15A22',
    fontSize: 16,
  },
});
