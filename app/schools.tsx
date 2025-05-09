import { useQuery } from '@tanstack/react-query';
import { usePathname, useRouter } from 'expo-router';
import { useState } from 'react';
import { ActivityIndicator, Button, FlatList, StyleSheet, Text, View, } from 'react-native';
import { addSchool, deleteSchool, fetchSchools } from '../src/api/schools';
import { useAuth } from '../src/store/auth';

import AddSchoolAdminModal from './addSchoolAdminModal';
import AddSchoolModal from './addSchoolModal';
import EditSchoolModal from './editSchoolModal';
import ManageSchoolModal from './manageSchoolModal';


import SchoolCard from './schoolCard';
import SchoolControls from './schoolControls';
import SidebarItem from './sidebarItem';


const PAGE_SIZE = 5; // Show 5 schools per page for now

type School = {
    id: number;
    name: string;
    address: string;
    city: string;
    country: string;
};

export default function Schools() {
    const [isModalVisible, setModalVisible] = useState(false);
    const [selectedSchool, setSelectedSchool] = useState<School | null>(null);
    const [showManageModal, setShowManageModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [showAddAdminModal, setShowAddAdminModal] = useState(false);


    const { data, isLoading, error } = useQuery<School[]>({
        queryKey: ['schools'],
        queryFn: fetchSchools,
    });

    const clearUser = useAuth((state) => state.clearUser);
    const router = useRouter();
    const pathname = usePathname();

    // Search, sort, pagination states
    const [searchQuery, setSearchQuery] = useState('');
    const [sortOption, setSortOption] = useState('name_asc');
    const [currentPage, setCurrentPage] = useState(1);

    const filteredSchools = data
        ? data
            .filter((school) =>
                school.name.toLowerCase().includes(searchQuery.toLowerCase())
            )
            .sort((a: School, b: School) => {
                switch (sortOption) {
                    case 'name_asc':
                        return a.name.localeCompare(b.name);
                    case 'name_desc':
                        return b.name.localeCompare(a.name);
                    case 'newest':
                        return b.id - a.id;
                    case 'oldest':
                        return a.id - b.id;
                    case 'city_asc':
                        return a.city.localeCompare(b.city);
                    case 'country_asc':
                        return a.country.localeCompare(b.country);
                    default:
                        return 0;
                }
            })
        : [];

    const totalPages = Math.ceil(filteredSchools.length / PAGE_SIZE);
    const paginatedSchools = filteredSchools.slice(
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
                <Text style={{ color: '#F69521' }}>Failed to load schools.</Text>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            {/* Sidebar */}
            <View style={styles.sidebar}>
                <Text style={styles.sidebarHeader}>DigiBackpack</Text>

                <SidebarItem
                    label="Dashboard"
                    icon="🏠"
                    path="/home-sysadmin"
                    currentPath={pathname}
                    onPress={() => router.replace('/home-sysadmin')}
                />

                <SidebarItem
                    label="Schools"
                    icon="🏫"
                    path="/schools"
                    currentPath={pathname}
                    onPress={() => router.replace('/schools')}
                />

                <SidebarItem
                    label="Users"
                    icon="👥"
                    path="/users"
                    currentPath={pathname}
                    onPress={() => { }}
                />

                <View style={{ flex: 1 }} />

                <SidebarItem
                    label="Logout"
                    icon="🚪"
                    path="/login"
                    currentPath={pathname}
                    onPress={() => {
                        clearUser();
                        router.replace('/login');
                    }}
                />
            </View>

            {/* Main Content */}
            <View style={styles.mainContent}>
                <View style={styles.headerRow}>
                    <Text style={styles.header}>Schools</Text>
                    <Button
                        title="Add New School"
                        onPress={() => setModalVisible(true)}
                        color="#F15A22"
                    />
                </View>

                {/* Search + Sort */}
                <SchoolControls
                    searchQuery={searchQuery}
                    onSearchChange={setSearchQuery}
                    sortOption={sortOption}
                    onSortChange={setSortOption}
                />

                {/* Schools List */}
                <FlatList
                    data={paginatedSchools}
                    keyExtractor={(item) => item.id.toString()}
                    renderItem={({ item }) => (
                        <SchoolCard
                            school={item}
                            onManage={() => {
                                setSelectedSchool(item);
                                setShowManageModal(true);
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
                        onPress={() =>
                            setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                        }
                    />
                </View>

                {/* Add School Modal */}
                <AddSchoolModal
                    isVisible={isModalVisible}
                    onClose={() => setModalVisible(false)}
                    onSubmit={async (formData) => {
                        console.log('Submit new school:', formData);

                        try {
                            const newSchool = await addSchool(formData);
                            console.log('Successfully added:', newSchool);
                            router.replace('/schools'); // refresh
                        } catch (error) {
                            console.error('Failed to add school:', error);
                            alert('Failed to add school');
                        }

                        setModalVisible(false);
                    }}
                />

                {/* Manage School Modal */}
                {selectedSchool && (
                    <ManageSchoolModal
                        school={selectedSchool}
                        isVisible={showManageModal}
                        onClose={() => setShowManageModal(false)}
                        onEdit={() => {
                            setShowManageModal(false);
                            setShowEditModal(true);
                        }}
                        onRegisterAdmin={() => {
                            setShowManageModal(false);
                            setShowAddAdminModal(true);
                        }}
                        onDelete={async () => {
                            try {
                                await deleteSchool(selectedSchool.id);
                                alert('School deleted successfully!');
                                setShowManageModal(false);
                                router.replace('/schools');
                            } catch (error) {
                                console.error(error);
                                alert('Failed to delete school.');
                            }
                        }}
                    />
                )}

                {selectedSchool && (
                    <>
                        <EditSchoolModal
                            school={selectedSchool}
                            isVisible={showEditModal}
                            onClose={() => setShowEditModal(false)}
                            onSave={() => {
                                setShowEditModal(false);
                                router.replace('/schools'); // refresh
                            }}
                        />

                        <AddSchoolAdminModal
                            schoolId={selectedSchool.id}
                            isVisible={showAddAdminModal}
                            onClose={() => setShowAddAdminModal(false)}
                            onSave={() => {
                                setShowAddAdminModal(false);
                                // optionally refetch admins if needed
                            }}
                        />
                    </>
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
    sidebar: {
        width: '15%',
        backgroundColor: '#124E57',
        padding: 16,
    },
    sidebarHeader: {
        color: '#FFFFFF',
        fontSize: 22,
        fontWeight: 'bold',
        marginBottom: 24,
        textAlign: 'center',
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
