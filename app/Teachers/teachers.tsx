import { useQuery, useQueryClient } from '@tanstack/react-query';
import { usePathname, useRouter } from 'expo-router';
import React, { useState } from 'react';
import { ActivityIndicator, Button, FlatList, StyleSheet, Text, View } from 'react-native';
import { fetchTeachers, Teacher } from '../../src/api/teachers';
import { useLogout } from '../../src/hooks/useLogout';
import { useAuth } from '../../src/store/auth';
import Sidebar from '../Shared/Sidebar';
import AddTeacherModal from './Components/addTeacherModal';
import EditTeacherModal from './Components/editTeacherModal';
import TeacherCard from './Components/teacherCard';
import TeacherControls from './Components/teacherControls';

const PAGE_SIZE = 5;

export default function Teachers() {
    const [searchQuery, setSearchQuery] = useState('');
    const [sortOption, setSortOption] = useState('name_asc');
    const [currentPage, setCurrentPage] = useState(1);
    const [isAddModalVisible, setAddModalVisible] = useState(false);
    const [isEditModalVisible, setEditModalVisible] = useState(false);
    const [selectedTeacher, setSelectedTeacher] = useState<Teacher | null>(null);

    const queryClient = useQueryClient();

    const { data, isLoading, error } = useQuery<Teacher[]>({
        queryKey: ['teachers'],
        queryFn: fetchTeachers,
    });

    const logout = useLogout();
    const user = useAuth((state) => state.user);
    const router = useRouter();
    const pathname = usePathname();

    const filteredTeachers = data
        ? data
            .filter((teacher) =>
                `${teacher.firstName} ${teacher.lastName}`.toLowerCase().includes(searchQuery.toLowerCase())
            )
            .sort((a, b) => {
                if (sortOption === 'name_asc') return a.firstName.localeCompare(b.firstName);
                if (sortOption === 'name_desc') return b.firstName.localeCompare(a.firstName);
                return 0;
            })
        : [];

    const totalPages = Math.ceil(filteredTeachers.length / PAGE_SIZE);
    const paginatedTeachers = filteredTeachers.slice(
        (currentPage - 1) * PAGE_SIZE,
        currentPage * PAGE_SIZE
    );

    if (isLoading) {
        return (
            <View style={styles.centered}>
                <ActivityIndicator size="large" color="#F69521" />
            </View>
        );
    }

    if (error) {
        return (
            <View style={styles.centered}>
                <Text style={{ color: '#F69521' }}>Failed to load teachers.</Text>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            {/* Sidebar */}
            <Sidebar onLogout={logout} />

            {/* Main Content */}
            <View style={styles.mainContent}>
                <View style={styles.headerRow}>
                    <Text style={styles.header}>Teachers</Text>
                    <Button title="Add New Teacher" color="#F15A22" onPress={() => setAddModalVisible(true)} />
                </View>

                {/* Search & Sort Controls */}
                <TeacherControls
                    searchQuery={searchQuery}
                    onSearchChange={setSearchQuery}
                    sortOption={sortOption}
                    onSortChange={setSortOption}
                />

                {/* Teacher List */}
                <FlatList
                    data={paginatedTeachers}
                    keyExtractor={(item) => item.id.toString()}
                    renderItem={({ item }) => (
                        <TeacherCard
                            teacher={item}
                            onManage={() => {
                                setSelectedTeacher(item);
                                setEditModalVisible(true);
                            }}
                        />
                    )}
                />

                {/* Pagination */}
                <View style={styles.paginationRow}>
                    <Button
                        title="Prev"
                        disabled={currentPage === 1}
                        onPress={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                    />
                    <Text style={styles.pageText}>
                        Page {currentPage} of {totalPages}
                    </Text>
                    <Button
                        title="Next"
                        disabled={currentPage === totalPages}
                        onPress={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                    />
                </View>

                {/* Modals */}
                <AddTeacherModal
                    isVisible={isAddModalVisible}
                    onClose={() => setAddModalVisible(false)}
                    onSubmit={() => {
                        setAddModalVisible(false);
                        queryClient.invalidateQueries({ queryKey: ['teachers'] });
                    }}
                    schoolId={user?.school?.id || 0}
                />

                {selectedTeacher && (
                    <EditTeacherModal
                        teacher={selectedTeacher}
                        isVisible={isEditModalVisible}
                        onClose={() => {
                            setEditModalVisible(false);
                            setSelectedTeacher(null);
                        }}
                        onSave={() => {
                            queryClient.invalidateQueries({ queryKey: ['teachers'] });
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
