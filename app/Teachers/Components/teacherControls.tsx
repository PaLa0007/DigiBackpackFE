import { Picker } from '@react-native-picker/picker';
import React from 'react';
import { StyleSheet, Text, TextInput, View } from 'react-native';

type Props = {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  sortOption: string;
  onSortChange: (option: string) => void;
};

const TeacherControls: React.FC<Props> = ({
  searchQuery,
  onSearchChange,
  sortOption,
  onSortChange,
}) => {
  return (
    <View style={styles.controlsContainer}>
      <TextInput
        placeholder="Search teachers..."
        value={searchQuery}
        onChangeText={onSearchChange}
        style={styles.searchInput}
      />

      <View style={styles.sortContainer}>
        <Text style={styles.sortLabel}>Sort by:</Text>
        <Picker
          selectedValue={sortOption}
          onValueChange={onSortChange}
          style={styles.picker}
        >
          <Picker.Item label="Name (A-Z)" value="name_asc" />
          <Picker.Item label="Name (Z-A)" value="name_desc" />
        </Picker>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  controlsContainer: {
    marginBottom: 16,
    gap: 12,
  },
  searchInput: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 10,
  },
  sortContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  sortLabel: {
    marginRight: 8,
    fontWeight: 'bold',
    color: '#124E57',
  },
  picker: {
    flex: 1,
  },
});

export default TeacherControls;
