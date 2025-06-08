import { useQuery, useQueryClient } from '@tanstack/react-query';
import React, { useState } from 'react';
import { Alert, Button, FlatList, StyleSheet, Text, View } from 'react-native';
import { Subject, deleteSubject, fetchSubjectsBySchool } from '../../src/api/subjects';
import { useLogout } from '../../src/hooks/useLogout';
import { useAuth } from '../../src/store/auth';
import Sidebar from '../Shared/Sidebar';
import AddSubjectModal from './Components/addSubjectModal';

export default function Subjects() {
  const { user } = useAuth();
  const logout = useLogout();
  const queryClient = useQueryClient();
  const [isAddModalVisible, setAddModalVisible] = useState(false);

  const { data: subjects = [], isLoading, error } = useQuery<Subject[]>({
    queryKey: ['subjects', user?.schoolId],
    queryFn: () => fetchSubjectsBySchool(user?.schoolId || 0),
    enabled: !!user?.schoolId,
  });

  const handleDelete = async (id: number) => {
    Alert.alert('Confirm', 'Delete this subject?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: async () => {
          await deleteSubject(id);
          queryClient.invalidateQueries({ queryKey: ['subjects'] });
        },
      },
    ]);
  };

  if (user?.role !== 'SCHOOL_ADMIN') {
    return (
      <View style={styles.centered}>
        <Text style={{ color: '#F15A22', fontSize: 16 }}>
          You are not authorized to view this screen.
        </Text>
      </View>
    );
  }

  if (isLoading) {
    return (
      <View style={styles.centered}>
        <Text style={{ color: '#F69521' }}>Loading subjects...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.centered}>
        <Text style={{ color: '#F15A22' }}>Failed to load subjects.</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Sidebar onLogout={logout} />

      <View style={styles.mainContent}>
        <View style={styles.headerRow}>
          <Text style={styles.header}>Subjects</Text>
          <Button title="Add New Subject" color="#F15A22" onPress={() => setAddModalVisible(true)} />
        </View>

        <FlatList
          data={subjects}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <View style={styles.subjectItem}>
              <Text style={styles.subjectName}>{item.name}</Text>
              <Button title="Delete" color="#F15A22" onPress={() => handleDelete(item.id)} />
            </View>
          )}
        />

        <AddSubjectModal
          visible={isAddModalVisible}
          onClose={() => setAddModalVisible(false)}
          onSaved={() => {
            queryClient.invalidateQueries({ queryKey: ['subjects'] });
            setAddModalVisible(false);
          }}
          schoolId={user.schoolId!}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
  },
  mainContent: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    padding: 16,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  header: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#124E57',
  },
  subjectItem: {
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderColor: '#ddd',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  subjectName: {
    fontSize: 16,
    color: '#124E57',
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#124E57',
  },
});
