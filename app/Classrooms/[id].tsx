import { useQuery } from '@tanstack/react-query';
import { format } from 'date-fns';
import { useLocalSearchParams } from 'expo-router';
import React, { useState } from 'react';
import { ActivityIndicator, FlatList, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { FeedItem, fetchClassroomFeed } from '../../src/api/classrooms';
import { useLogout } from '../../src/hooks/useLogout';
import { useAuth } from '../../src/store/auth';
import Sidebar from '../Shared/Sidebar';

export default function ClassroomFeed() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const logout = useLogout();
  const user = useAuth((state) => state.user);
  const [activeTab, setActiveTab] = useState<'assignment' | 'material'>('assignment');

  const { data: feedItems, isLoading, error } = useQuery({
    queryKey: ['classroom-feed', id],
    queryFn: () => fetchClassroomFeed(Number(id)),
    enabled: !!id,
  });

  if (isLoading) {
    return (
      <View style={styles.wrapper}>
        <Sidebar onLogout={logout} />
        <View style={styles.centered}>
          <ActivityIndicator size="large" color="#F69521" />
        </View>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.wrapper}>
        <Sidebar onLogout={logout} />
        <View style={styles.centered}>
          <Text style={styles.error}>Failed to load feed.</Text>
        </View>
      </View>
    );
  }

  const filteredItems =
    user?.role === 'STUDENT'
      ? feedItems?.filter((item) => item.type === activeTab)
      : feedItems;

  return (
    <View style={styles.wrapper}>
      <Sidebar onLogout={logout} />
      <View style={styles.mainContent}>
        <Text style={styles.title}>Classroom Feed</Text>

        {user?.role === 'STUDENT' && (
          <View style={styles.tabBar}>
            <TouchableOpacity
              style={[styles.tabButton, activeTab === 'assignment' && styles.activeTab]}
              onPress={() => setActiveTab('assignment')}
            >
              <Text style={styles.tabText}>Assignments</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.tabButton, activeTab === 'material' && styles.activeTab]}
              onPress={() => setActiveTab('material')}
            >
              <Text style={styles.tabText}>Materials</Text>
            </TouchableOpacity>
          </View>
        )}

        <FlatList
          data={filteredItems}
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

  tabBar: {
  flexDirection: 'row',
  marginBottom: 16,
},
tabButton: {
  flex: 1,
  paddingVertical: 10,
  backgroundColor: '#E0E0E0',
  alignItems: 'center',
  borderRadius: 6,
  marginRight: 8,
},
activeTab: {
  backgroundColor: '#F15A22',
},
tabText: {
  color: '#124E57',
  fontWeight: 'bold',
},

});
