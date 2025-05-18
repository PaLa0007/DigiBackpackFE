import { useQuery } from '@tanstack/react-query';
import { useLocalSearchParams } from 'expo-router';
import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';
import { fetchClassroomFeed } from '../../../src/api/classrooms';

export default function ClassroomFeed() {
  const { id } = useLocalSearchParams<{ id: string }>();

  const { data: feedItems, isLoading, error } = useQuery({
    queryKey: ['classroom-feed', id],
    queryFn: () => fetchClassroomFeed(Number(id)),
    enabled: !!id,
  });

  if (isLoading) {
    return <View style={styles.centered}><ActivityIndicator size="large" color="#F69521" /></View>;
  }

  if (error) {
    return <View style={styles.centered}><Text style={styles.error}>Failed to load feed.</Text></View>;
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Classroom Feed</Text>
      {feedItems?.map((item, index) => (
        <View key={index} style={styles.feedItem}>
          <Text style={styles.feedType}>[{item.type.toUpperCase()}]</Text>
          <Text style={styles.feedTitle}>{item.title || '(No Title)'}</Text>
          <Text style={styles.feedDescription}>{item.description}</Text>
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: '#FFFFFF' },
  title: { fontSize: 24, fontWeight: 'bold', color: '#124E57', marginBottom: 20 },
  feedItem: { backgroundColor: '#F1F1F1', padding: 16, borderRadius: 8, marginBottom: 12 },
  feedType: { fontSize: 12, fontWeight: 'bold', color: '#F15A22' },
  feedTitle: { fontSize: 18, fontWeight: 'bold', color: '#15808D' },
  feedDescription: { fontSize: 14, color: '#555' },
  centered: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#124E57' },
  error: { color: '#F15A22', fontSize: 16 },
});
