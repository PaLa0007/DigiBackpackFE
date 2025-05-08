import { useQuery } from '@tanstack/react-query';
import { usePathname, useRouter } from 'expo-router';
import { useState } from 'react';
import {
    ActivityIndicator,
    Button,
    FlatList,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';
import { fetchSchools } from '../src/api/schools';
import { useAuth } from '../src/store/auth';

import { addSchool } from '../src/api/schools';
import AddSchoolModal from './addSchoolModal';



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

                <TouchableOpacity
                    style={[
                        styles.sidebarItem,
                        pathname === '/home-sysadmin' && styles.activeSidebarItem,
                    ]}
                    onPress={() => router.replace('/home-sysadmin')}
                >
                    <Text
                        style={[
                            styles.sidebarText,
                            pathname === '/home-sysadmin' && styles.activeSidebarText,
                        ]}
                    >
                        🏠 Dashboard
                    </Text>
                </TouchableOpacity>

                <TouchableOpacity
                    style={[
                        styles.sidebarItem,
                        pathname === '/schools' && styles.activeSidebarItem,
                    ]}
                    onPress={() => router.replace('/schools')}
                >
                    <Text
                        style={[
                            styles.sidebarText,
                            pathname === '/schools' && styles.activeSidebarText,
                        ]}
                    >
                        🏫 Schools
                    </Text>
                </TouchableOpacity>

                <TouchableOpacity
                    style={[
                        styles.sidebarItem,
                        pathname === '/users' && styles.activeSidebarItem,
                    ]}
                //onPress={() => router.replace('/users')}
                >
                    <Text
                        style={[
                            styles.sidebarText,
                            pathname === '/users' && styles.activeSidebarText,
                        ]}
                    >
                        👥 Users
                    </Text>
                </TouchableOpacity>

                <View style={{ flex: 1 }} />

                <TouchableOpacity
                    style={styles.sidebarItem}
                    onPress={() => {
                        clearUser();
                        router.replace('/login');
                    }}
                >
                    <Text style={styles.sidebarText}>🚪 Logout</Text>
                </TouchableOpacity>
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
                <View style={styles.controlsRow}>
                    <TextInput
                        style={styles.searchInput}
                        placeholder="Search schools..."
                        value={searchQuery}
                        onChangeText={setSearchQuery}
                    />
                    <View style={styles.sortContainer}>
                        <Text style={{ marginRight: 8, color: '#124E57' }}>Sort by:</Text>
                        <select
                            value={sortOption}
                            onChange={(e) => setSortOption(e.target.value)}
                            style={styles.sortSelect}
                        >
                            <option value="name_asc">Name (A-Z)</option>
                            <option value="name_desc">Name (Z-A)</option>
                            <option value="newest">Newest First</option>
                            <option value="oldest">Oldest First</option>
                            <option value="city_asc">City (A-Z)</option>
                            <option value="country_asc">Country (A-Z)</option>
                        </select>
                    </View>
                </View>

                {/* Schools List */}
                <FlatList
                    data={paginatedSchools}
                    keyExtractor={(item) => item.id.toString()}
                    renderItem={({ item }) => (
                        <View style={styles.card}>
                            <Text style={styles.cardTitle}>{item.name}</Text>
                            <Text style={styles.cardText}>{item.address}</Text>
                            <TouchableOpacity
                                style={styles.manageButton}
                                onPress={() =>
                                    console.log(`Manage School ID: ${item.id}`)
                                }
                            >
                                <Text style={styles.manageButtonText}>Manage</Text>
                            </TouchableOpacity>
                        </View>
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

                {/* Add School Form */}
                <AddSchoolModal
                    isVisible={isModalVisible}
                    onClose={() => setModalVisible(false)}
                    onSubmit={async (formData) => {
                        console.log('Submit new school:', formData);

                        try {
                            const newSchool = await addSchool(formData);
                            console.log('Successfully added:', newSchool);
                            // Ideally you can now refetch or update the local list:
                            router.replace('/schools'); // simple way to refresh
                        } catch (error) {
                            console.error('Failed to add school:', error);
                            alert('Failed to add school');
                        }

                        setModalVisible(false);
                    }}
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
    sidebar: {
        width: '15%',
        backgroundColor: '#124E57', // Dark Teal
        padding: 16,
    },
    sidebarHeader: {
        color: '#FFFFFF',
        fontSize: 22,
        fontWeight: 'bold',
        marginBottom: 24,
        textAlign: 'center',
    },
    sidebarItem: {
        paddingVertical: 12,
    },
    sidebarText: {
        color: '#FFFFFF',
        fontSize: 18,
    }, activeSidebarItem: {
        backgroundColor: '#15808D', // Balanced Teal
        borderRadius: 8,
        paddingVertical: 12,
        paddingHorizontal: 8,
        marginBottom: 8,
    },
    activeSidebarText: {
        fontWeight: 'bold',
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
    controlsRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 16,
        flexWrap: 'wrap',
    },
    searchInput: {
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 8,
        padding: 8,
        width: '60%',
        marginBottom: 8,
    },
    sortContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        width: '35%',
    },
    sortSelect: {
        padding: 8,
        borderRadius: 8,
        borderColor: '#ccc',
    },
    card: {
        backgroundColor: '#E0F7FA',
        padding: 16,
        borderRadius: 8,
        marginBottom: 12,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.15,
        shadowRadius: 4,
        elevation: 3,
    },
    cardTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#124E57',
        marginBottom: 4,
    },
    cardText: {
        color: '#124E57',
        marginBottom: 8,
    },
    manageButton: {
        backgroundColor: '#15808D',
        paddingVertical: 8,
        borderRadius: 6,
        alignItems: 'center',
    },
    manageButtonText: {
        color: '#FFFFFF',
        fontWeight: 'bold',
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
