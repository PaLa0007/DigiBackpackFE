import { useQuery } from '@tanstack/react-query';
import { useRouter } from 'expo-router';
import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';
import { fetchStudents } from '../src/api/students';
import { fetchTeachers } from '../src/api/teachers';
import { useAuth } from '../src/store/auth';
import DashboardCard from './Shared/DashboardCard'; // adjust path as needed
import Sidebar from './Shared/Sidebar';


export default function HomeSchoolAdmin() {
    const { data: teachers, isLoading: loadingTeachers } = useQuery({
        queryKey: ['teachers'],
        queryFn: fetchTeachers,
    });

    const { data: students, isLoading: loadingStudents } = useQuery({
        queryKey: ['students'],
        queryFn: fetchStudents,
    });

    const clearUser = useAuth((state) => state.clearUser);
    const user = useAuth((state) => state.user);
    const router = useRouter();

    if (loadingTeachers || loadingStudents) {
        return (
            <View style={styles.centered}>
                <ActivityIndicator size="large" color="#F69521" />
            </View>
        );
    }

    const totalTeachers = teachers?.length ?? 0;
    const totalStudents = students?.length ?? 0;

    return (
        <View style={styles.container}>
            <Sidebar
                onLogout={() => {
                    clearUser();
                    router.replace('/login');
                }}
            />

            <View style={styles.mainContent}>
                <Text style={styles.header}>
                    Welcome, {user?.firstName} {user?.lastName}!
                </Text>

                <View style={styles.cardContainer}>
                    <DashboardCard title="Teachers" count={totalTeachers} />
                    <DashboardCard title="Students" count={totalStudents} />
                </View>
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
    header: {
        fontSize: 26,
        marginVertical: 16,
        textAlign: 'center',
        fontWeight: 'bold',
        color: '#124E57',
    },
    cardContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
    },
    centered: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#124E57',
    },
});
