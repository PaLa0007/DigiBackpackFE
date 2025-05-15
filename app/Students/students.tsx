import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { ActivityIndicator, Button, FlatList, StyleSheet, Text, View } from 'react-native';
import { fetchStudents, Student } from '../../src/api/students';
import { useAuth } from '../../src/store/auth';
import Sidebar from '../Shared/Sidebar';
import AddStudentModal from './Components/addStudentModal';
import EditStudentModal from './Components/editStudentModal';
import StudentCard from './Components/studentCard';
import StudentControls from './Components/studentControls';

const PAGE_SIZE = 5;

export default function Students() {
  const [searchQuery, setSearchQuery] = useState('');
  const [sortOption, setSortOption] = useState('name_asc');
  const [currentPage, setCurrentPage] = useState(1);
  const [isAddModalVisible, setAddModalVisible] = useState(false);
  const [isEditModalVisible, setEditModalVisible] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);

  const queryClient = useQueryClient();
  const { data, isLoading, error } = useQuery<Student[]>({
    queryKey: ['students'],
    queryFn: fetchStudents,
  });

  const clearUser = useAuth((state) => state.clearUser);
  const user = useAuth((state) => state.user);
  const router = useRouter();

  const filteredStudents = data
    ? data.filter((s) => `${s.firstName} ${s.lastName}`.toLowerCase().includes(searchQuery.toLowerCase()))
        .sort((a, b) => sortOption === 'name_asc'
          ? a.firstName.localeCompare(b.firstName)
          : b.firstName.localeCompare(a.firstName))
    : [];

  const totalPages = Math.ceil(filteredStudents.length / PAGE_SIZE);
  const paginatedStudents = filteredStudents.slice(
    (currentPage - 1) * PAGE_SIZE,
    currentPage * PAGE_SIZE
  );

  if (isLoading) {
    return <View style={styles.centered}><ActivityIndicator size="large" color="#F69521" /></View>;
  }

  if (error) {
    return <View style={styles.centered}><Text style={{ color: '#F69521' }}>Failed to load students.</Text></View>;
  }

  return (
    <View style={styles.container}>
      <Sidebar
        onLogout={() => {
          clearUser();
          router.replace('/login');
        }}
      />

      <View style={styles.mainContent}>
        <View style={styles.headerRow}>
          <Text style={styles.header}>Students</Text>
          <Button title="Add New Student" color="#F15A22" onPress={() => setAddModalVisible(true)} />
        </View>

        <StudentControls
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          sortOption={sortOption}
          onSortChange={setSortOption}
        />

        <FlatList
          data={paginatedStudents}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <StudentCard
              student={item}
              onManage={() => {
                setSelectedStudent(item);
                setEditModalVisible(true);
              }}
            />
          )}
        />

        <View style={styles.paginationRow}>
          <Button title="Prev" disabled={currentPage === 1} onPress={() => setCurrentPage((prev) => Math.max(prev - 1, 1))} />
          <Text style={styles.pageText}>Page {currentPage} of {totalPages}</Text>
          <Button title="Next" disabled={currentPage === totalPages} onPress={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))} />
        </View>

        <AddStudentModal
          isVisible={isAddModalVisible}
          onClose={() => setAddModalVisible(false)}
          onSubmit={() => {
            setAddModalVisible(false);
            queryClient.invalidateQueries({ queryKey: ['students'] });
          }}
          schoolId={user?.schoolId || 0}
        />

        {selectedStudent && (
          <EditStudentModal
            student={selectedStudent}
            isVisible={isEditModalVisible}
            onClose={() => {
              setEditModalVisible(false);
              setSelectedStudent(null);
            }}
            onSave={() => {
              queryClient.invalidateQueries({ queryKey: ['students'] });
              setEditModalVisible(false);
            }}
          />
        )}
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
  paginationRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 16,
  },
  pageText: {
    marginHorizontal: 16,
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
