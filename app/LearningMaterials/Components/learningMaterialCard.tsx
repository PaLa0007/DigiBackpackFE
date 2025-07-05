import React from 'react';
import { Alert, Linking, Platform, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { BASE_URL } from '../../../src/api/api';
import { LearningMaterialDto, deleteLearningMaterial } from '../../../src/api/learningMaterials';

interface Props {
  material: LearningMaterialDto;
  currentUserId: number;
  onDeleted: () => void;
}

const LearningMaterialCard: React.FC<Props> = ({ material, currentUserId, onDeleted }) => {
  const handleDelete = async () => {
    const confirm = Platform.OS === 'web'
      ? window.confirm('Are you sure you want to delete this file?')
      : await new Promise((resolve) => {
        Alert.alert(
          'Delete Material',
          'Are you sure you want to delete this file?',
          [
            { text: 'Cancel', style: 'cancel', onPress: () => resolve(false) },
            { text: 'Delete', style: 'destructive', onPress: () => resolve(true) },
          ]
        );
      });

    if (confirm) {
      try {
        await deleteLearningMaterial(material.id);
        onDeleted();
      } catch (err) {
        console.error('Failed to delete material:', err);
      }
    }
  };

  return (
    <View style={styles.card}>
      <Text style={styles.title}>{material.title}</Text>
      {material.description ? (
        <Text style={styles.description}>{material.description}</Text>
      ) : null}

      <TouchableOpacity
        style={styles.downloadButton}
        onPress={() => {
          const filename = material.fileUrl.split('/').pop();
          const downloadUrl = `${BASE_URL}/learning-materials/download/${encodeURIComponent(filename ?? '')}`;
          Linking.openURL(downloadUrl);
        }}
      >
        <Text style={styles.downloadButtonText}>⬇️ Download</Text>
      </TouchableOpacity>

      {material.uploadedById === currentUserId && (
        <TouchableOpacity style={styles.deleteButton} onPress={handleDelete}>
          <Text style={styles.deleteButtonText}>🗑️ Delete</Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderColor: '#E0E0E0',
    borderWidth: 1,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    color: '#124E57',
    marginBottom: 4,
  },
  description: {
    color: '#444',
    fontSize: 14,
    marginBottom: 8,
  },
  downloadButton: {
    backgroundColor: '#15808D',
    paddingVertical: 8,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 8,
  },
  downloadButtonText: {
    color: '#fff',
    fontWeight: '600',
  },
  deleteButton: {
    backgroundColor: '#F15A22',
    paddingVertical: 8,
    borderRadius: 8,
    alignItems: 'center',
  },
  deleteButtonText: {
    color: '#fff',
    fontWeight: '600',
  },
});

export default LearningMaterialCard;
