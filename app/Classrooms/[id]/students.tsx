import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useLocalSearchParams } from 'expo-router';
import React from 'react';
import { ActivityIndicator, FlatList, StyleSheet, Text, View } from 'react-native';
import api from '../../../src/api/api';
import { fetchClassroomById } from '../../../src/api/classrooms';
import {
    assignStudentToClassroom,
    fetchAllStudentClassrooms,
    StudentClassroomDto,
} from '../../../src/api/studentClassroom';
import { fetchStudents } from '../../../src/api/students';
import { useLogout } from '../../../src/hooks/useLogout';
import { useAuth } from '../../../src/store/auth';
import StudentCard from '../../Classrooms/Components/studentCard';
import Sidebar from '../../Shared/Sidebar';

export default function ManageStudentsScreen() {
    const { id } = useLocalSearchParams<{ id: string }>();
    const classroomId = Number(id);
    const logout = useLogout();
    const user = useAuth((state) => state.user);
    const queryClient = useQueryClient();

    if (user?.role !== 'SCHOOL_ADMIN') {
        return null;
    }

    const { data: students, isLoading: loadingStudents } = useQuery({
        queryKey: ['students'],
        queryFn: fetchStudents,
    });

    const { data: assignments = [] } = useQuery<StudentClassroomDto[]>({
        queryKey: ['student-classrooms'],
        queryFn: fetchAllStudentClassrooms,
    });

    const { data: classroom, isLoading: loadingClassroom } = useQuery({
        queryKey: ['classroom', classroomId],
        queryFn: () => fetchClassroomById(classroomId),
        enabled: !!classroomId,
    });

    const handleRemoveStudent = async (studentId: number) => {
        try {
            const latestAssignments = await queryClient.fetchQuery({
                queryKey: ['student-classrooms'],
                queryFn: fetchAllStudentClassrooms,
            });

            const link = latestAssignments.find(
                (a: StudentClassroomDto) => a.studentId === studentId && a.classroomId === classroomId
            );
            if (!link) return;

            await api.delete(`/student-classrooms/removeStudent/${link.id}`);
            queryClient.invalidateQueries({ queryKey: ['student-classrooms'] });
        } catch { }
    };



    const handleAddStudent = async (studentId: number) => {
        try {
            await assignStudentToClassroom({ studentId, classroomId });
            await queryClient.invalidateQueries({ queryKey: ['student-classrooms'] });
        } catch (error) {
            console.error('Error assigning student to classroom:', error);
        }
    };


    if (loadingStudents || loadingClassroom) {
        return (
            <View style={styles.wrapper}>
                <Sidebar onLogout={logout} />
                <View style={styles.centered}>
                    <ActivityIndicator size="large" color="#F69521" />
                </View>
            </View>
        );
    }

    const assignedStudentIds = assignments
        .filter((a) => a.classroomId === classroomId)
        .map((a) => a.studentId);

    const assigned = students?.filter((s) => assignedStudentIds.includes(s.id)) ?? [];

    const unassignedInGrade =
        students?.filter(
            (s) => s.gradeLevel === String(classroom?.grade) && !assignedStudentIds.includes(s.id)
        ) ?? [];

    return (
        <View style={styles.wrapper}>
            <Sidebar onLogout={logout} />
            <View style={styles.mainContent}>
                <Text style={styles.title}>Manage Students in Classroom</Text>

                <Text style={styles.subtitle}>Assigned Students</Text>
                <FlatList
                    data={assigned}
                    keyExtractor={(s) => s.id.toString()}
                    renderItem={({ item }) => (
                        <StudentCard
                            student={item}
                            primaryActionLabel="Remove"
                            onPrimaryAction={() => handleRemoveStudent(item.id)}
                            variant="manage"
                        />
                    )}
                />

                <Text style={styles.subtitle}>Students in Same Grade (Not Yet Assigned)</Text>
                <FlatList
                    data={unassignedInGrade}
                    keyExtractor={(s) => s.id.toString()}
                    renderItem={({ item }) => (
                        <StudentCard
                            student={item}
                            primaryActionLabel="Add"
                            onPrimaryAction={() => handleAddStudent(item.id)}
                            variant="add"
                        />
                    )}
                />
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
    subtitle: {
        fontSize: 18,
        fontWeight: '600',
        marginTop: 24,
        marginBottom: 8,
        color: '#15808D',
    },
    centered: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#FFFFFF',
    },
});
