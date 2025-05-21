import { useQuery } from '@tanstack/react-query';
import { format } from 'date-fns';
import { useLocalSearchParams } from 'expo-router';
import {
  ActivityIndicator,
  FlatList,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { FeedItem, fetchClassroomFeed } from '../../src/api/classrooms';
import { useAuth } from '../../src/store/auth';
import Sidebar from '../Shared/Sidebar';

export default function ClassroomFeed() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const clearUser = useAuth((state) => state.clearUser);

  const { data: feedItems, isLoading, error } = useQuery({
    queryKey: ['classroom-feed', id],
    queryFn: () => fetchClassroomFeed(Number(id)),
    enabled: !!id,
  });

  if (isLoading) {
    return (
      <View style={styles.wrapper}>
        <Sidebar onLogout={clearUser} />
        <View style={styles.centered}>
          <ActivityIndicator size="large" color="#F69521" />
        </View>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.wrapper}>
        <Sidebar onLogout={clearUser} />
        <View style={styles.centered}>
          <Text style={styles.error}>Failed to load feed.</Text>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.wrapper}>
      <Sidebar onLogout={clearUser} />
      <View style={styles.mainContent}>
        <Text style={styles.title}>Classroom Feed</Text>

        <FlatList
          data={feedItems}
          keyExtractor={(_, index) => index.toString()}
          renderItem={({ item }: { item: FeedItem }) => (
            <View style={styles.feedItem}>
              <Text style={styles.feedType}>[{item.type.toUpperCase()}]</Text>
              {item.title && <Text style={styles.feedTitle}>{item.title}</Text>}
              <Text style={styles.feedDescription}>{item.description}</Text>
              <Text style={styles.meta}>
                Posted by {item.createdBy} on{' '}
                {format(new Date(item.createdAt), 'dd MMM yyyy, HH:mm')}
              </Text>
            </View>
          )}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: '#F2F2F2',
  },
  mainContent: {
    flex: 1,
    padding: 16,
    backgroundColor: '#FFFFFF',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#124E57',
    marginBottom: 20,
  },
  feedItem: {
    backgroundColor: '#F1F1F1',
    padding: 16,
    borderRadius: 8,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 3,
    shadowOffset: { width: 0, height: 1 },
  },
  feedType: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#F15A22',
  },
  feedTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#15808D',
  },
  feedDescription: {
    fontSize: 14,
    color: '#555',
    marginTop: 4,
  },
  meta: {
    fontSize: 12,
    color: '#777',
    marginTop: 6,
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
  },
  error: {
    color: '#F15A22',
    fontSize: 16,
  },
});
