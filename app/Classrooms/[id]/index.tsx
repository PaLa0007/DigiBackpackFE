import { useQuery, useQueryClient } from '@tanstack/react-query';
import { format } from 'date-fns';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  Linking,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from 'react-native';
import { AssignmentDto, deleteAssignment, fetchAssignmentById } from '../../../src/api/assignments';
import { fetchClassroomFeed } from '../../../src/api/classrooms';
import { deleteComment, postClassroomComment, updateComment } from '../../../src/api/comments';
import { useLogout } from '../../../src/hooks/useLogout';
import { useAuth } from '../../../src/store/auth';
import AddAssignmentModal from '../../Assignments/Components/AddAssignmentModal';
import EditAssignmentModal from '../../Assignments/Components/EditAssignmentModal';
import SubmissionUploader from '../../Assignments/Components/SubmissionUploader';
import UploadLearningMaterialModal from '../../LearningMaterials/Components/uploadLearningMaterialModal';
import Sidebar from '../../Shared/Sidebar';

export default function ClassroomFeed() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const logout = useLogout();
  const user = useAuth((state) => state.user);
  const queryClient = useQueryClient();

  const [activeTab, setActiveTab] = useState<'all' | 'assignment' | 'material'>('all');
  const [addModalVisible, setAddModalVisible] = useState(false);
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [selectedAssignment, setSelectedAssignment] = useState<AssignmentDto | null>(null);
  const [uploadModalVisible, setUploadModalVisible] = useState(false);
  const [editingMessageId, setEditingMessageId] = useState<number | null>(null);
  const [pressedAction, setPressedAction] = useState(false);

  const [newMessage, setNewMessage] = useState('');

  useEffect(() => {
    if (user?.role === 'SCHOOL_ADMIN' && id) {
      router.replace({
        pathname: '/Classrooms/[id]/students',
        params: { id: String(id) },
      });
    }
  }, [user, id]);

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
    try {
      console.log('Attempting to delete assignment with ID:', assignmentId);
      await deleteAssignment(assignmentId);
      console.log('Deletion successful, invalidating classroom-feed cache');
      await queryClient.invalidateQueries({ queryKey: ['classroom-feed', id] });
    } catch (error) {
      console.error('Error during assignment deletion:', error);
    }
  };

  const handlePostMessage = async () => {
    if (!newMessage.trim() || !user) return;
    try {
      if (editingMessageId) {
        // Update existing [MESSAGE]
        await updateComment(editingMessageId, `[Message] ${newMessage.trim()}`, user.id);
      } else {
        // Post new [MESSAGE]
        await postClassroomComment(Number(id), user.id, `[Message] ${newMessage.trim()}`);
      }
      setNewMessage('');
      setEditingMessageId(null);
      queryClient.invalidateQueries({ queryKey: ['classroom-feed', id] });
    } catch (error) {
      console.error('Failed to submit message:', error);
    }
  };


  const filteredItems = feedItems?.filter((item) => {
    if (activeTab === 'all') return true;
    return item.type === activeTab;
  }).sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

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

  return (
    <View style={styles.wrapper}>
      <Sidebar onLogout={logout} />
      <View style={styles.mainContent}>
        <View style={styles.tabBar}>
          {['all', 'assignment', 'material'].map((tab) => (
            <TouchableOpacity
              key={tab}
              style={[styles.tabButton, activeTab === tab && styles.activeTab]}
              onPress={() => setActiveTab(tab as any)}
            >
              <Text style={styles.tabText}>
                {tab === 'all' ? 'All' : tab === 'assignment' ? 'Assignments' : 'Materials'}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {user?.role === 'TEACHER' && (
          <>
            <TouchableOpacity style={styles.addButton} onPress={() => setAddModalVisible(true)}>
              <Text style={styles.addButtonText}>Add Assignment</Text>
            </TouchableOpacity>
            <AddAssignmentModal
              visible={addModalVisible}
              onClose={() => setAddModalVisible(false)}
              onAdded={() => queryClient.invalidateQueries({ queryKey: ['classroom-feed', id] })}
              classroomId={Number(id)}
              classroomOptions={[]}
            />
            <TouchableOpacity style={styles.addButton} onPress={() => setUploadModalVisible(true)}>
              <Text style={styles.addButtonText}>Upload Learning Material</Text>
            </TouchableOpacity>
            <UploadLearningMaterialModal
              visible={uploadModalVisible}
              onClose={() => setUploadModalVisible(false)}
              uploadedById={user.id}
              onUploadSuccess={() => queryClient.invalidateQueries({ queryKey: ['classroom-feed', id] })}
              classroomId={Number(id)}
            />
          </>
        )}

        {user?.role === 'SCHOOL_ADMIN' && (
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
            <Text style={styles.studentPreviewText}>Tap to view, add, or remove students in this classroom.</Text>
          </TouchableOpacity>
        )}

        <FlatList
          data={filteredItems}
          keyExtractor={(item) => item.id?.toString() ?? Math.random().toString()}
          renderItem={({ item }) => {
            // Debug visibility check
            console.log('MESSAGE VISIBILITY CHECK', {
              createdByInItem: item.createdBy,
              currentUsername: user?.username
            });

            // Normalized matching for safety
            const isMessageOwner =
              item.createdBy?.toLowerCase().replace(/\s/g, '') ===
              user?.username?.toLowerCase().replace(/\s/g, '');

            return (
              <View style={styles.feedItem}>
                {item.type === 'message' && (
                  <>
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                      <Text style={styles.feedType}>[MESSAGE]</Text>

                      {isMessageOwner && (
                        <View style={{ flexDirection: 'row', gap: 8, alignItems: 'center' }}>
                          <TouchableOpacity
                            style={[styles.actionButton, { backgroundColor: '#15808D', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 16 }]}
                            onPress={() => {
                              setNewMessage(item.description.replace('[Message]', '').trim());
                              setEditingMessageId(item.id!);
                            }}
                          >
                            <Text style={{ color: 'white', fontWeight: '600' }}>Edit</Text>
                          </TouchableOpacity>

                          <TouchableOpacity
                            style={[styles.actionButton, { backgroundColor: '#D32F2F', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 16 }]}
                            onPress={async () => {
                              try {
                                await deleteComment(item.id!, user.id);
                                if (editingMessageId === item.id) {
                                  // Reset edit state if user was editing this message
                                  setNewMessage('');
                                  setEditingMessageId(null);
                                }
                                queryClient.invalidateQueries({ queryKey: ['classroom-feed', id] });
                              } catch (error) {
                                console.error('Failed to delete message:', error);
                              }
                            }}
                          >
                            <Text style={{ color: 'white', fontWeight: '600' }}>Delete</Text>
                          </TouchableOpacity>
                        </View>
                      )}
                    </View>
                    <Text style={styles.meta}>
                      {item.createdBy} · {format(new Date(item.createdAt), 'dd MMM yyyy, HH:mm')}
                    </Text>
                    <Text style={styles.feedDescription}>{item.description.replace('[Message]', '').trim()}</Text>
                  </>
                )}

                {item.type === 'assignment' && (
                  <>
                    <View>
                      <Text style={styles.feedType}>[ASSIGNMENT]</Text>
                      {item.title && <Text style={styles.feedTitle}>{item.title}</Text>}
                      <Text style={styles.feedDescription}>{item.description}</Text>
                      <Text style={styles.meta}>
                        Posted by {item.createdBy} on {format(new Date(item.createdAt), 'dd MMM yyyy, HH:mm')}
                      </Text>
                    </View>

                    {/* Student submission uploader */}
                    {user?.role === 'STUDENT' && item.id && (
                      <SubmissionUploader
                        assignmentId={item.id}
                        onUploaded={() =>
                          queryClient.invalidateQueries({ queryKey: ['classroom-feed', id] })
                        }
                      />
                    )}

                    {/* Teacher actions: View | Edit | Delete */}
                    {user?.role === 'TEACHER' && item.id && (
                      <View style={styles.actionsRow}>
                        {/* View button */}
                        <TouchableOpacity
                          style={styles.actionButton}
                          onPress={() =>
                            router.push({
                              pathname: '/Assignments/[id]',
                              params: { id: String(item.id) },
                            })
                          }
                        >
                          <Text style={styles.actionButtonText}>View</Text>
                        </TouchableOpacity>

                        {/* Edit button */}
                        <TouchableOpacity
                          style={styles.actionButton}
                          onPress={() => openEditModal(item.id!)}
                        >
                          <Text style={styles.actionButtonText}>Edit</Text>
                        </TouchableOpacity>

                        {/* Delete button in red */}
                        <TouchableOpacity
                          style={[styles.actionButton, { backgroundColor: '#D32F2F' }]}
                          onPress={async () => {
                            try {
                              console.log(`Delete pressed for assignment ID: ${item.id}`);
                              await handleDelete(item.id!);
                            } catch (error) {
                              console.error('Failed to delete assignment:', error);
                            }
                          }}
                        >
                          <Text style={styles.actionButtonText}>Delete</Text>
                        </TouchableOpacity>
                      </View>
                    )}
                  </>
                )}

                {item.type === 'material' && (
                  <>
                    <Text style={styles.feedType}>[MATERIAL]</Text>
                    {item.title && <Text style={styles.feedTitle}>{item.title}</Text>}
                    <Text style={styles.feedDescription}>{item.description}</Text>
                    <Text style={styles.meta}>
                      Posted by {item.createdBy} on {format(new Date(item.createdAt), 'dd MMM yyyy, HH:mm')}
                    </Text>

                    {item.fileUrl && (
                      <TouchableOpacity
                        style={[styles.fullWidthButton, { backgroundColor: '#15808D' }]}
                        onPress={() => {
                          const filename = item.fileUrl?.split('/').pop();
                          if (!filename) return;
                          const downloadUrl = `http://192.168.31.100:8165/api/learning-materials/download/${encodeURIComponent(filename ?? '')}`;
                          Linking.openURL(downloadUrl);
                        }}
                      >
                        <Text style={styles.buttonText}>⬇️ Download Material</Text>
                      </TouchableOpacity>

                    )}

                    {user?.role === 'TEACHER' && item.id && (
                      <TouchableOpacity
                        style={[styles.fullWidthButton, { backgroundColor: '#D32F2F' }]}
                        onPress={async () => {
                          try {
                            console.log(`Delete pressed for material ID: ${item.id}`);
                            await handleDelete(item.id!);
                          } catch (error) {
                            console.error('Failed to delete material:', error);
                          }
                        }}
                      >
                        <Text style={styles.buttonText}>🗑️ Delete Material</Text>
                      </TouchableOpacity>
                    )}
                  </>
                )}

              </View>
            );
          }}
        />


        {/* Bottom input for class messages */}
        <View style={styles.inputRow}>
          <TextInput
            style={styles.commentInput}
            placeholder="Write a message to the class..."
            value={newMessage}
            onChangeText={setNewMessage}
          />
          <TouchableOpacity
            style={[
              styles.postButton,
              { backgroundColor: newMessage.trim() === '' ? '#ccc' : '#15808D' }
            ]}
            onPress={handlePostMessage}
            disabled={newMessage.trim() === ''}
          >
            <Text style={styles.postButtonText}>Post</Text>
          </TouchableOpacity>
        </View>

        {selectedAssignment && (
          <EditAssignmentModal
            visible={editModalVisible}
            assignment={selectedAssignment}
            onClose={() => setEditModalVisible(false)}
            onUpdated={() => queryClient.invalidateQueries({ queryKey: ['classroom-feed', id] })}
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
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  feedType: {
    fontSize: 12,
    fontWeight: '600',
    color: '#F15A22',
    marginBottom: 4,
  },
  feedTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#124E57',
    marginBottom: 4,
  },
  feedDescription: {
    fontSize: 14,
    color: '#444',
    marginBottom: 4,
  },
  meta: {
    fontSize: 12,
    color: '#777',
    marginBottom: 8,
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
  actionsRow: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: 8,
    gap: 8,
  },
  actionButton: {
    backgroundColor: '#15808D',
    paddingVertical: 8,
    paddingHorizontal: 12,
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
    paddingHorizontal: 12,
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
    paddingHorizontal: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 8,
  },
  deleteButtonText: {
    color: '#fff',
    fontWeight: '600',
  },

  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 8,
    borderRadius: 6,
    backgroundColor: '#fff',
  },

  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4, // reduced from 12 to 4
    marginBottom: 8, // added slight bottom margin for breathing room
    paddingHorizontal: 8,
  },
  commentInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 20,
    paddingVertical: 10,
    paddingHorizontal: 16,
    fontSize: 14,
    backgroundColor: '#fff',
  },
  postButton: {
    marginLeft: 8,
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  postButtonText: {
    color: '#fff',
    fontWeight: '600',
  },

  fullWidthButton: {
    marginTop: 8,
    paddingVertical: 10,      // reduced from 12 to 10 for subtle size reduction
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 3,
    elevation: 1,
  },
  buttonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 14,
  },

});



