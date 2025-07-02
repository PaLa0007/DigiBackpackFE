import { useQuery, useQueryClient } from '@tanstack/react-query';
import { format } from 'date-fns';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useState } from 'react';
import { ActivityIndicator, FlatList, Linking, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { AssignmentDto, deleteAssignment, fetchAssignmentById } from '../../../src/api/assignments';
import { FeedItem, fetchClassroomFeed } from '../../../src/api/classrooms';
import { deleteLearningMaterial } from '../../../src/api/learningMaterials';
import { useLogout } from '../../../src/hooks/useLogout';
import { useAuth } from '../../../src/store/auth';
import AddAssignmentModal from '../../Assignments/Components/AddAssignmentModal';
import EditAssignmentModal from '../../Assignments/Components/EditAssignmentModal';
import UploadLearningMaterialModal from '../../LearningMaterials/Components/uploadLearningMaterialModal';


import Sidebar from '../../Shared/Sidebar';

export default function ClassroomFeed() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const logout = useLogout();
  const user = useAuth((state) => state.user);
  const [activeTab, setActiveTab] = useState<'assignment' | 'material'>('assignment');
  const [addModalVisible, setAddModalVisible] = useState(false);
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [selectedAssignment, setSelectedAssignment] = useState<AssignmentDto | null>(null);
  const queryClient = useQueryClient();
  const [uploadModalVisible, setUploadModalVisible] = useState(false);



  const { data: feedItems, isLoading, error } = useQuery({
    queryKey: ['classroom-feed', id],
    queryFn: () => fetchClassroomFeed(Number(id)),
    enabled: !!id,
  });

  const openEditModal = async (assignmentId: number) => {
    const fullAssignment = await fetchAssignmentById(assignmentId);
    setSelectedAssignment(fullAssignment);
    setEditModalVisible(true);
  };

  const handleDelete = async (assignmentId: number) => {
    await deleteAssignment(assignmentId);
    queryClient.invalidateQueries({ queryKey: ['classroom-feed', id] });
  };

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

  if (error) {
    return (
      <View style={styles.wrapper}>
        <Sidebar onLogout={logout} />
        <View style={styles.centered}>
          <Text style={styles.error}>Failed to load feed.</Text>
        </View>
      </View>
    );
  }

  const filteredItems =
    user?.role === 'STUDENT'
      ? feedItems?.filter((item) => item.type === activeTab)
      : feedItems;

  return (
    <View style={styles.wrapper}>
      <Sidebar onLogout={logout} />
      <View style={styles.mainContent}>
        <Text style={styles.title}>Classroom Feed</Text>

        {user?.role === 'STUDENT' && (
          <View style={styles.tabBar}>
            <TouchableOpacity
              style={[styles.tabButton, activeTab === 'assignment' && styles.activeTab]}
              onPress={() => setActiveTab('assignment')}
            >
              <Text style={styles.tabText}>Assignments</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.tabButton, activeTab === 'material' && styles.activeTab]}
              onPress={() => setActiveTab('material')}
            >
              <Text style={styles.tabText}>Materials</Text>
            </TouchableOpacity>
          </View>
        )}

        {user?.role === 'TEACHER' && (
          <>
            <TouchableOpacity
              style={styles.addButton}
              onPress={() => setAddModalVisible(true)}
            >
              <Text style={styles.addButtonText}>Add Assignment</Text>
            </TouchableOpacity>

            <AddAssignmentModal
              visible={addModalVisible}
              onClose={() => setAddModalVisible(false)}
              onAdded={() => {
                setAddModalVisible(false);
                queryClient.invalidateQueries({ queryKey: ['classroom-feed', id] });
              }}
              classroomId={Number(id)}
              classroomOptions={[]}
            />

            <TouchableOpacity
              style={styles.addButton}
              onPress={() => setUploadModalVisible(true)}
            >
              <Text style={styles.addButtonText}>Upload Learning Material</Text>
            </TouchableOpacity>

          </>
        )}

        {user?.role === 'TEACHER' && (
          <TouchableOpacity
            style={styles.studentPreviewCard}
            onPress={() =>
              router.push({
                pathname: '/Classrooms/[id]/students',
                params: { id: String(id) },
              })
            }
          >
            <Text style={styles.studentPreviewTitle}>Manage Students</Text>
            <Text style={styles.studentPreviewText}>
              Tap to view, add, or remove students in this classroom.
            </Text>
          </TouchableOpacity>
        )}

        {user?.role === 'TEACHER' && (
          <UploadLearningMaterialModal
            visible={uploadModalVisible}
            onClose={() => setUploadModalVisible(false)}
            uploadedById={user.id}
            onUploadSuccess={() => {
              setUploadModalVisible(false);
              queryClient.invalidateQueries({ queryKey: ['classroom-feed', id] });
            }}
            classroomId={Number(id)}
          />
        )}



        <FlatList
          data={filteredItems}
          keyExtractor={(_, index) => index.toString()}
          renderItem={({ item }: { item: FeedItem }) => {
            console.log('FEED ITEM', item); // ✅ Log for debugging

            return (
              <View style={styles.feedItem}>
                <Text style={styles.feedType}>[{item.type.toUpperCase()}]</Text>
                {item.title && <Text style={styles.feedTitle}>{item.title}</Text>}
                <Text style={styles.feedDescription}>{item.description}</Text>
                <Text style={styles.meta}>
                  Posted by {item.createdBy} on{' '}
                  {format(new Date(item.createdAt), 'dd MMM yyyy, HH:mm')}
                </Text>

                {/* ✅ Assignment actions (teachers) */}
                {user?.role === 'TEACHER' && item.type === 'assignment' && item.id && (
                  <View style={styles.actionsRow}>
                    <TouchableOpacity
                      style={styles.actionButton}
                      onPress={() => openEditModal(item.id!)}
                    >
                      <Text style={styles.actionButtonText}>Edit</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                      style={[styles.actionButton, { backgroundColor: '#D32F2F' }]}
                      onPress={() => handleDelete(item.id!)}
                    >
                      <Text style={styles.actionButtonText}>Delete</Text>
                    </TouchableOpacity>
                  </View>
                )}

                {/* ✅ Material actions (students and teachers) */}
                {item.type === 'material' && item.fileUrl && (
                  <>
                    {/* Download button */}
                    <TouchableOpacity
                      style={styles.downloadButton}
                      onPress={() => {
                        const filename = item.fileUrl?.split('/').pop();
                        if (!filename) return;
                        const downloadUrl = `http://192.168.31.100:8165/api/learning-materials/download/${encodeURIComponent(filename ?? '')}`;
                        Linking.openURL(downloadUrl);
                      }}
                    >
                      <Text style={styles.downloadButtonText}>⬇️ Download Material</Text>
                    </TouchableOpacity>

                    {/* Delete button (teachers only) */}
                    {user?.role === 'TEACHER' && item.id && (
                      <TouchableOpacity
                        style={styles.deleteButton}
                        onPress={async () => {
                          const confirm = window.confirm('Are you sure you want to delete this material?');
                          if (!confirm) return;
                          try {
                            if (!item.id) return;
                            await deleteLearningMaterial(item.id);
                            queryClient.invalidateQueries({ queryKey: ['classroom-feed', id] });
                          } catch (error) {
                            console.error('Failed to delete material:', error);
                          }
                        }}
                      >
                        <Text style={styles.deleteButtonText}>🗑️ Delete Material</Text>
                      </TouchableOpacity>
                    )}
                  </>
                )}
              </View>
            );
          }}

        />


        {/*<FlatList
          data={filteredItems}
          keyExtractor={(_, index) => index.toString()}
          renderItem={({ item }: { item: FeedItem }) => (
            <View style={styles.feedItem}>
              <Text style={styles.feedType}>[{item.type.toUpperCase()}]</Text>
              {item.title && <Text style={styles.feedTitle}>{item.title}</Text>}
              <Text style={styles.feedDescription}>{item.description}</Text>
              <Text style={styles.meta}>
                Posted by {item.createdBy} on{' '}
                {format(new Date(item.createdAt), 'dd MMM yyyy, HH:mm')}
              </Text>

              {user?.role === 'TEACHER' && item.type === 'assignment' && item.id && (
                <View style={styles.actionsRow}>
                  <TouchableOpacity
                    style={styles.actionButton}
                    onPress={() => openEditModal(item.id!)}
                  >
                    <Text style={styles.actionButtonText}>Edit</Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={[styles.actionButton, { backgroundColor: '#D32F2F' }]}
                    onPress={() => handleDelete(item.id!)}
                  >
                    <Text style={styles.actionButtonText}>Delete</Text>
                  </TouchableOpacity>
                </View>

              )}
            </View>
          )}
        />*/}

        {selectedAssignment && (
          <EditAssignmentModal
            visible={editModalVisible}
            assignment={selectedAssignment}
            onClose={() => setEditModalVisible(false)}
            onUpdated={() => {
              queryClient.invalidateQueries({ queryKey: ['classroom-feed', id] });
              setEditModalVisible(false);
            }}
          />
        )}
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
    marginBottom: 20,
  },
  feedItem: {
    backgroundColor: '#F1F1F1',
    padding: 16,
    borderRadius: 8,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 3,
    shadowOffset: { width: 0, height: 1 },
  },
  feedType: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#F15A22',
  },
  feedTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#15808D',
  },
  feedDescription: {
    fontSize: 14,
    color: '#555',
    marginTop: 4,
  },
  meta: {
    fontSize: 12,
    color: '#777',
    marginTop: 6,
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
  tabBar: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  tabButton: {
    flex: 1,
    paddingVertical: 10,
    backgroundColor: '#E0E0E0',
    alignItems: 'center',
    borderRadius: 6,
    marginRight: 8,
  },
  activeTab: {
    backgroundColor: '#F15A22',
  },
  tabText: {
    color: '#124E57',
    fontWeight: 'bold',
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

  // ✅ ADD THESE
  actionsRow: {
    flexDirection: 'row',
    marginTop: 8,
    gap: 8,
  },
  actionButton: {
    backgroundColor: '#15808D',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
  },
  actionButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  studentPreviewCard: {
    backgroundColor: '#E8F5F7',
    padding: 16,
    borderRadius: 8,
    marginBottom: 16,
    borderLeftWidth: 4,
    borderLeftColor: '#15808D',
  },
  studentPreviewTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#124E57',
  },
  studentPreviewText: {
    fontSize: 14,
    color: '#555',
    marginTop: 4,
  },

  downloadButton: {
    backgroundColor: '#15808D',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 8,
  },
  downloadButtonText: {
    color: '#fff',
    fontWeight: '600',
  },
  deleteButton: {
    backgroundColor: '#D32F2F',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 8,
  },
  deleteButtonText: {
    color: '#fff',
    fontWeight: '600',
  },

});



