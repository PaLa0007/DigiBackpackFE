import { useQuery } from '@tanstack/react-query';
import { ActivityIndicator, FlatList, Text, View } from 'react-native';
import { fetchSchools } from '../src/api/schools';

export default function HomeSysAdmin() {
  const { data, isLoading, error } = useQuery({
    queryKey: ['schools'],
    queryFn: fetchSchools,
  });

  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  if (error) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text style={{ color: 'red' }}>Failed to load schools.</Text>
      </View>
    );
  }

  return (
    <View style={{ flex: 1, padding: 16 }}>
      <Text style={{ fontSize: 24, marginBottom: 16 }}>Welcome, Sysadmin!</Text>
      <FlatList
        data={data}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View
            style={{
              padding: 12,
              borderWidth: 1,
              borderColor: '#ccc',
              marginBottom: 8,
              borderRadius: 8,
            }}
          >
            <Text style={{ fontSize: 18 }}>{item.name}</Text>
            <Text>{item.address}</Text>
          </View>
        )}
      />
    </View>
  );
}
