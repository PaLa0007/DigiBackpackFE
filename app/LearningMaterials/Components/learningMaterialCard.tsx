import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { Alert, Linking, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { LearningMaterialDto, deleteLearningMaterial } from '../../../src/api/learningMaterials';

interface Props {
  material: LearningMaterialDto;
  currentUserId: number;
  onDeleted: () => void;
}

const LearningMaterialCard: React.FC<Props> = ({ material, currentUserId, onDeleted }) => {
  const handleDelete = () => {
    Alert.alert('Delete Material', 'Are you sure you want to delete this file?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: async () => {
          try {
            await deleteLearningMaterial(material.id);
            onDeleted();
          } catch (err) {
            console.error('Failed to delete material:', err);
          }
        },
      },
    ]);
  };

  return (
    <View style={styles.card}>
      <View style={styles.cardHeader}>
        <Text style={styles.title}>{material.title}</Text>
        {material.uploadedById === currentUserId && (
          <TouchableOpacity onPress={handleDelete}>
            <Ionicons name="trash" size={20} color="red" />
          </TouchableOpacity>
        )}
      </View>

      {material.description ? <Text style={styles.description}>{material.description}</Text> : null}

      <TouchableOpacity onPress={() => Linking.openURL(material.fileUrl)}>
        <Text style={styles.link}>{material.fileUrl.split('/').pop()}</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#f9f9f9',
    padding: 16,
    marginBottom: 12,
    borderRadius: 12,
    borderColor: '#ccc',
    borderWidth: 1,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  title: {
    fontWeight: 'bold',
    fontSize: 18,
    color: '#124E57',
  },
  description: {
    color: '#333',
    marginBottom: 4,
  },
  link: {
    color: '#15808D',
    fontWeight: '500',
    textDecorationLine: 'underline',
  },
});

export default LearningMaterialCard;
