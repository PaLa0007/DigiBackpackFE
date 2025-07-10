import React, { useEffect, useState } from 'react';
import { FlatList, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { AssignmentDto, deleteAssignment, fetchAssignments } from '../../src/api/assignments';
import { fetchTeacherClassrooms } from '../../src/api/classrooms';
import { useAuth } from '../../src/store/auth';

import Sidebar from '../Shared/Sidebar';
import AddAssignmentModal from './Components/AddAssignmentModal';
import AssignmentCard from './Components/AssignmentCard';
import EditAssignmentModal from './Components/EditAssignmentModal';

type ClassroomOption = { id: number; name: string };

const AssignmentsScreen: React.FC = () => {
  const [assignments, setAssignments] = useState<AssignmentDto[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [editData, setEditData] = useState<AssignmentDto | null>(null);
  const [classroomOptions, setClassroomOptions] = useState<ClassroomOption[]>([]);
  const { user } = useAuth();

  const loadAssignments = async () => {
    const data = await fetchAssignments();
    setAssignments(data);
  };

  const loadClassrooms = async () => {
    if (user?.role === 'TEACHER') {
      const data = await fetchTeacherClassrooms(user.id);
      const options = data.map((cls) => ({
        id: cls.id,
        name: cls.name,
      }));
      setClassroomOptions(options);
    }
  };

  useEffect(() => {
    loadAssignments();
    loadClassrooms();
  }, []);

  if (!user) return null;

  return (
    <View style={styles.container}>
      <Sidebar onLogout={() => console.log('TODO: logout')} />

      <View style={styles.content}>
        {user.role === 'TEACHER' && (
          <>
            <TouchableOpacity
              style={styles.addButton}
              onPress={() => setShowModal(true)}
            >
              <Text style={styles.addButtonText}>Add Assignment</Text>
            </TouchableOpacity>

            <AddAssignmentModal
              visible={showModal}
              onClose={() => setShowModal(false)}
              onAdded={loadAssignments}
              classroomOptions={classroomOptions}
            />

            {editData && (
              <EditAssignmentModal
                visible={editModalVisible}
                assignment={editData}
                onClose={() => {
                  setEditModalVisible(false);
                  setEditData(null);
                }}
                onUpdated={loadAssignments}
              />
            )}
          </>
        )}

        <FlatList
          data={assignments}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <AssignmentCard
              assignment={item}
              onEdit={
                user.role === 'TEACHER'
                  ? () => {
                      setEditData(item);
                      setEditModalVisible(true);
                    }
                  : undefined
              }
              onDelete={
                user.role === 'TEACHER'
                  ? async () => {
                      await deleteAssignment(item.id);
                      await loadAssignments();
                    }
                  : undefined
              }
            />
          )}
          contentContainerStyle={styles.list}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
  },
  content: {
    flex: 1,
    padding: 16,
  },
  list: {
    paddingTop: 10,
  },
  addButton: {
    backgroundColor: '#F15A22',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 16,
  },
  addButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default AssignmentsScreen;
