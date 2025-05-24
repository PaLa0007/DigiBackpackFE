import { useQuery } from '@tanstack/react-query';
import { useRouter } from 'expo-router';
import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';
import { fetchTeacherDashboardStats } from '../src/api/teachers';
import { useAuth } from '../src/store/auth';
import { useLogout } from './../src/hooks/useLogout';
import DashboardCard from './Shared/DashboardCard';
import Sidebar from './Shared/Sidebar';

export default function HomeTeacher() {
    const user = useAuth((state) => state.user);
    const logout = useLogout();
    const router = useRouter();

    const { data: stats, isLoading: loadingStats } = useQuery({
        queryKey: ['teacher-dashboard-stats', user?.id],
        queryFn: () => fetchTeacherDashboardStats(user?.id ?? 0),
        enabled: !!user?.id,
    });

    if (!user || loadingStats || !stats) {
        return (
            <View style={styles.centered}>
                <ActivityIndicator size="large" color="#F69521" />
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <Sidebar onLogout={logout} />

            <View style={styles.mainContent}>
                <Text style={styles.header}>Welcome, {user.firstName} {user.lastName}!</Text>

                <View style={styles.cardContainer}>
                    <DashboardCard title="Classes Taught" count={stats.classroomCount} />
                    <DashboardCard title="Assignments Created" count={stats.assignmentCount} />
                    <DashboardCard title="Materials Uploaded" count={stats.materialCount} />
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
