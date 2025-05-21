import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
    ActivityIndicator,
    FlatList,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import {
    Classroom,
    ClassroomPayload,
    createClassroom,
    deleteClassroom,
    fetchTeacherClassrooms,
    updateClassroom,
} from '../../src/api/classrooms';
import { useAuth } from '../../src/store/auth';
import Sidebar from '../Shared/Sidebar';
import AddClassroomModal from './Components/addClassroomModal';
import ClassroomCard from './Components/classroomCard';
import EditClassroomModal from './Components/editClassroomModal';

export default function TeacherClassrooms() {
    const user = useAuth((state) => state.user);
    const clearUser = useAuth((state) => state.clearUser);
    const router = useRouter();
    const queryClient = useQueryClient();

    const [isAddVisible, setAddVisible] = useState(false);
    const [isEditVisible, setEditVisible] = useState(false);
    const [editData, setEditData] = useState<Classroom | null>(null);

    const { data: classrooms, isLoading, error } = useQuery({
        queryKey: ['teacher-classrooms'],
        queryFn: () => fetchTeacherClassrooms(user?.id ?? 0),
        enabled: !!user?.id,
    });

    const handleCreate = async (payload: ClassroomPayload) => {
        try {
            await createClassroom({ ...payload, teacherId: user!.id });
            setAddVisible(false);
            queryClient.invalidateQueries({ queryKey: ['teacher-classrooms'] });
        } catch {
            alert('Failed to create classroom.');
        }
    };

    const handleEdit = async (payload: ClassroomPayload) => {
        if (!editData) return;
        try {
            await updateClassroom(editData.id, payload);
            setEditVisible(false);
            setEditData(null);
            queryClient.invalidateQueries({ queryKey: ['teacher-classrooms'] });
        } catch {
            alert('Failed to update classroom.');
        }
    };

    const handleDelete = async (id: number) => {
        try {
            await deleteClassroom(id);
            queryClient.invalidateQueries({ queryKey: ['teacher-classrooms'] });
        } catch {
            alert('Failed to delete classroom.');
        }
    };

    if (isLoading) {
        return (
            <View style={styles.wrapper}>
                <Sidebar onLogout={clearUser} />
                <View style={styles.centered}>
                    <ActivityIndicator size="large" color="#F69521" />
                </View>
            </View>
        );
    }

    if (error) {
        return (
            <View style={styles.wrapper}>
                <Sidebar onLogout={clearUser} />
                <View style={styles.centered}>
                    <Text style={styles.error}>Failed to load classrooms.</Text>
                </View>
            </View>
        );
    }

    return (
        <View style={styles.wrapper}>
            <Sidebar onLogout={clearUser} />
            <View style={styles.mainContent}>
                <Text style={styles.title}>Your Classes</Text>

                <TouchableOpacity
                    style={styles.addButton}
                    onPress={() => setAddVisible(true)}
                >
                    <Text style={styles.addButtonText}>Add Classroom</Text>
                </TouchableOpacity>

                <FlatList
                    data={classrooms}
                    keyExtractor={(item) => item.id.toString()}
                    renderItem={({ item }) => (
                        <ClassroomCard
                            classroom={item}
                            onEdit={() => {
                                setEditData(item);
                                setEditVisible(true);
                            }}
                            onDelete={() => handleDelete(item.id)}
                        />
                    )}
                />

                <AddClassroomModal
                    isVisible={isAddVisible}
                    onClose={() => setAddVisible(false)}
                    onSubmit={handleCreate}
                />

                {editData && (
                    <EditClassroomModal
                        isVisible={isEditVisible}
                        onClose={() => {
                            setEditVisible(false);
                            setEditData(null);
                        }}
                        onSubmit={handleEdit}
                        initialData={{ name: editData.name, grade: String(editData.grade) }}
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
