import React, { useEffect, useState } from 'react';
import { Button, FlatList, StyleSheet, Text, View } from 'react-native';
import { downloadSubmissionFile, fetchSubmissions, SubmissionDto } from '../../../src/api/submissions';
import { useAuth } from '../../../src/store/auth';

type Props = {
  assignmentId: number;
  refreshKey?: number;
};

const SubmissionList: React.FC<Props> = ({ assignmentId, refreshKey }) => {
  const { user } = useAuth();
  const [submissions, setSubmissions] = useState<SubmissionDto[]>([]);

  const load = async () => {
    const data = await fetchSubmissions(assignmentId);
    setSubmissions(
      user?.role === 'TEACHER'
        ? data
        : data.filter((sub) => sub.studentId === user?.id)
    );
  };

  useEffect(() => {
    load();
  }, [refreshKey]);

  const handleDownload = async (submissionId: number, fileId: number, fileName: string) => {
    try {
      const uri = await downloadSubmissionFile(submissionId, fileId, fileName);
      if (uri) {
        console.log(`Downloaded ${fileName} to:`, uri);
      } else {
        console.log(`Download triggered for ${fileName} on web.`);
      }
    } catch (error) {
      console.error('Download failed:', error);
    }
  };

  return (
    <View style={{ marginTop: 16 }}>
      <FlatList
        data={submissions}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View style={styles.card}>
            {user?.role === 'TEACHER' && (
              <Text style={styles.studentName}>
                👤 {item.studentFirstName} {item.studentLastName}
              </Text>
            )}

            <Text style={styles.dateText}>
              Submitted on: {new Date(item.submittedAt).toLocaleDateString()}
            </Text>

            {item.description && (
              <Text style={styles.descriptionText}>
                📝 {item.description}
              </Text>
            )}

            {item.files && item.files.length > 0 ? (
              item.files.map((file) => (
                <View key={file.id} style={styles.fileRow}>
                  <Text style={styles.fileName}>📄 {file.fileName}</Text>
                  <Button
                    title="Download"
                    color="#15808D"
                    onPress={() => handleDownload(item.id, file.id, file.fileName)}
                  />
                </View>
              ))
            ) : (
              <Text style={styles.noFilesText}>No files uploaded (description only)</Text>
            )}

          </View>
        )}
        ListEmptyComponent={
          <Text style={styles.emptyText}>No submissions yet for this assignment.</Text>
        }
        contentContainerStyle={styles.listContent}
      />
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
  studentName: {
    fontWeight: '600',
    color: '#124E57',
    marginBottom: 4,
  },
  dateText: {
    fontSize: 12,
    color: '#555',
    marginBottom: 6,
  },
  descriptionText: {
    fontSize: 14,
    color: '#333',
    fontStyle: 'italic',
    marginBottom: 8,
  },
  fileRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  fileName: {
    color: '#124E57',
    flex: 1,
    fontSize: 14,
  },
  noFilesText: {
    fontSize: 13,
    color: '#555',
    marginTop: 6,
  },
  emptyText: {
    textAlign: 'center',
    color: '#888',
    marginTop: 16,
    fontSize: 14,
  },
  listContent: {
    paddingBottom: 40,
  },
});

export default SubmissionList;
