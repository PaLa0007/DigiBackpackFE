import { useQuery } from '@tanstack/react-query';
import { useRouter } from 'expo-router';
import { ActivityIndicator, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { fetchTeacherClassrooms } from '../../src/api/classrooms';
import { useAuth } from '../../src/store/auth';

export default function TeacherClassrooms() {
    const user = useAuth((state) => state.user);
    const router = useRouter();

    const { data: classrooms, isLoading, error } = useQuery({
        queryKey: ['teacher-classrooms'],
        queryFn: () => fetchTeacherClassrooms(user?.id ?? 0),
        enabled: !!user?.id,
    });

    if (isLoading) {
        return <View style={styles.centered}><ActivityIndicator size="large" color="#F69521" /></View>;
    }

    if (error) {
        return <View style={styles.centered}><Text style={styles.error}>Failed to load classrooms.</Text></View>;
    }

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Your Classes</Text>
            {classrooms?.map((classroom) => (
                <TouchableOpacity
                    key={classroom.id}
                    style={styles.card}
                    onPress={() => router.push({
                        pathname: '/Teacher/classrooms/[id]',
                        params: { id: classroom.id.toString() },
                    })}
                >
                    <Text style={styles.classroomName}>{classroom.name}</Text>
                    <Text style={styles.classroomDetails}>Grade {classroom.grade}</Text>
                </TouchableOpacity>
            ))
            }
        </View >
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, padding: 16, backgroundColor: '#FFFFFF' },
    title: { fontSize: 24, fontWeight: 'bold', color: '#124E57', marginBottom: 20 },
    card: { backgroundColor: '#E0F7FA', padding: 16, borderRadius: 8, marginBottom: 12 },
    classroomName: { fontSize: 18, fontWeight: 'bold', color: '#15808D' },
    classroomDetails: { fontSize: 14, color: '#777' },
    centered: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#124E57' },
    error: { color: '#F15A22', fontSize: 16 },
});