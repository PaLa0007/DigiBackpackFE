import { useQuery, useQueryClient } from '@tanstack/react-query';
import { usePathname, useRouter } from 'expo-router';
import { useState } from 'react';
import { ActivityIndicator, Button, FlatList, StyleSheet, Text, View, } from 'react-native';
import { addSchool, deleteSchool, fetchSchools } from '../../src/api/schools';
import { useLogout } from '../../src/hooks/useLogout';

import AddSchoolAdminModal from './Components/addSchoolAdminModal';
import AddSchoolModal from './Components/addSchoolModal';
import EditSchoolAdminModal from './Components/editSchoolAdminModal';
import EditSchoolModal from './Components/editSchoolModal';
import ManageSchoolModal from './Components/manageSchoolModal';

import Sidebar from '../Shared/Sidebar';
import SchoolCard from './Components/schoolCard';
import SchoolControls from './Components/schoolControls';


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
    const [editingAdmin, setEditingAdmin] = useState<any>(null);
    const [showEditAdminModal, setShowEditAdminModal] = useState(false);
    const [refetchAdmins, setRefetchAdmins] = useState<(() => void) | null>(null);
    const [refetchSchoolDetails, setRefetchSchoolDetails] = useState<(() => void) | null>(null);
    const queryClient = useQueryClient();


    const { data, isLoading, error } = useQuery<School[]>({
        queryKey: ['schools'],
        queryFn: fetchSchools,
    });

    const logout = useLogout();
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
            <Sidebar onLogout={logout} />

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
                            router.replace('/Schools/schools'); // refresh
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
                                router.replace('/Schools/schools');
                            } catch (error) {
                                console.error(error);
                                alert('Failed to delete school.');
                            }
                        }}
                        onEditAdmin={(admin) => {
                            setEditingAdmin(admin);
                            setShowEditAdminModal(true);
                        }}
                        onAdminsRefetch={(refetchFn) => {
                            setRefetchAdmins(() => refetchFn);  // store refetch fn in state
                        }}
                        onSchoolRefetch={(refetchFn) => {
                            setRefetchSchoolDetails(() => refetchFn);  // Store refetch for later
                        }}
                    />
                )}

                {selectedSchool && (
                    <>
                        <EditSchoolModal
                            school={selectedSchool}
                            isVisible={showEditModal}
                            onClose={() => setShowEditModal(false)}
                            onSave={(updatedData) => {
                                setShowEditModal(false);
                                refetchSchoolDetails?.();

                                // 🔁 Update top-level school list
                                queryClient.setQueryData(['schools'], (old: School[] | undefined) => {
                                    if (!old) return [];
                                    return old.map((s) =>
                                        s.id === updatedData.id ? { ...s, ...updatedData } : s
                                    );
                                });
                            }}
                        />

                        <AddSchoolAdminModal
                            schoolId={selectedSchool.id}
                            isVisible={showAddAdminModal}
                            onClose={() => setShowAddAdminModal(false)}
                            onSave={() => {
                                setShowAddAdminModal(false);
                                if (refetchAdmins) {
                                    refetchAdmins();  // refresh admins after adding
                                }
                            }}
                        />
                    </>
                )}

                {editingAdmin && (
                    <EditSchoolAdminModal
                        admin={editingAdmin}
                        isVisible={showEditAdminModal}
                        onClose={() => setShowEditAdminModal(false)}
                        onSave={() => {
                            setShowEditAdminModal(false);
                            if (refetchAdmins) {
                                refetchAdmins();  // refresh admins after adding
                            }
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
