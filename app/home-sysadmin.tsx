import { useQuery } from '@tanstack/react-query';
import { usePathname, useRouter } from 'expo-router';
import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';
import { fetchSchools } from '../src/api/schools';
import { useAuth } from '../src/store/auth';

import Sidebar from './Shared/Sidebar';



export default function HomeSysAdmin() {
  const route = useRouter();
  const pathname = usePathname();

  const { data, isLoading, error } = useQuery({
    queryKey: ['schools'],
    queryFn: fetchSchools,
  });

  const clearUser = useAuth((state) => state.clearUser);
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
      <Sidebar
        onLogout={() => {
          clearUser();
          router.replace('/login');
        }}
      />



      {/* Main Content */}
      <View style={styles.mainContent}>
        <Text style={styles.header}>
          Welcome, {user?.firstName} {user?.lastName}!
        </Text>

        <View style={styles.cardContainer}>
          <View style={styles.card}>
            <Text style={styles.cardTitle}>Schools</Text>
            <Text style={styles.cardCount}>{totalSchools}</Text>
          </View>
          <View style={styles.card}>
            <Text style={styles.cardTitle}>School Admins</Text>
            <Text style={styles.cardCount}>{totalSchoolAdmins}</Text>
          </View>
          <View style={styles.card}>
            <Text style={styles.cardTitle}>Teachers</Text>
            <Text style={styles.cardCount}>{totalTeachers}</Text>
          </View>
          <View style={styles.card}>
            <Text style={styles.cardTitle}>Students</Text>
            <Text style={styles.cardCount}>{totalStudents}</Text>
          </View>
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
  card: {
    backgroundColor: '#E0F7FA', // Light Teal / Cyan
    padding: 20,
    borderRadius: 12,
    width: '48%',
    marginBottom: 16,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 5,
  },
  cardTitle: {
    fontSize: 18,
    marginBottom: 8,
    fontWeight: '600',
    color: '#124E57', // Dark Teal
  },
  cardCount: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#F69521', // Catalyst Yellow
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#124E57',
  },
});
