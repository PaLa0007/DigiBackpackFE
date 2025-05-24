import { useQuery } from '@tanstack/react-query';
import { usePathname, useRouter } from 'expo-router';
import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';
import { fetchSchools } from '../src/api/schools';
import { useAuth } from '../src/store/auth';
import { useLogout } from './../src/hooks/useLogout';

import DashboardCard from './Shared/DashboardCard';
import Sidebar from './Shared/Sidebar';


export default function HomeSysAdmin() {
  const route = useRouter();
  const pathname = usePathname();

  const { data, isLoading, error } = useQuery({
    queryKey: ['schools'],
    queryFn: fetchSchools,
  });

  const logout = useLogout();
  const user = useAuth((state) => state.user);
  const router = useRouter();

  const totalSchools = data ? data.length : 0;
  const totalSchoolAdmins = 10; // Placeholder
  const totalTeachers = 50;     // Placeholder
  const totalStudents = 400;    // Placeholder

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
        <Text style={{ color: '#F69521' }}>Failed to load dashboard data.</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Sidebar */}
      <Sidebar onLogout={logout} />



      {/* Main Content */}
      <View style={styles.mainContent}>
        <Text style={styles.header}>
          Welcome, {user?.firstName} {user?.lastName}!
        </Text>

        <View style={styles.cardContainer}>
          <DashboardCard title="Schools" count={totalSchools} />
          <DashboardCard title="School Admins" count={totalSchoolAdmins} />
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
    backgroundColor: '#FFFFFF', // White background
    padding: 16,
  },
  header: {
    fontSize: 26,
    marginVertical: 16,
    textAlign: 'center',
    fontWeight: 'bold',
    color: '#124E57', // Dark Teal text
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
