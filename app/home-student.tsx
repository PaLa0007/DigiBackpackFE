import { useQuery } from '@tanstack/react-query';
import { useRouter } from 'expo-router';
import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';
import { fetchStudentDashboard } from '../src/api/students';
import { useAuth } from '../src/store/auth';
import { useLogout } from './../src/hooks/useLogout';
import DashboardCard from './Shared/DashboardCard';
import Sidebar from './Shared/Sidebar';

export default function HomeStudent() {
    const user = useAuth((state) => state.user);
    const logout = useLogout();
    const router = useRouter();

    const { data: dashboardData, isLoading } = useQuery({
        queryKey: ['student-dashboard', user?.id],
        queryFn: () => fetchStudentDashboard(user?.id ?? 0),
        enabled: !!user?.id,
    });

    if (!user || isLoading) {
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
                <Text style={styles.header}>
                    Welcome, {user.firstName} {user.lastName}!
                </Text>

                <View style={styles.cardContainer}>
                    <DashboardCard
                        title="Upcoming Assignments"
                        count={dashboardData?.upcomingAssignments ?? 0}
                    />
                    <DashboardCard
                        title="Materials Available"
                        count={dashboardData?.materialsAvailable ?? 0}
                    />
                    <DashboardCard
                        title="Classes Enrolled"
                        count={dashboardData?.classroomCount ?? 0}
                    />
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
