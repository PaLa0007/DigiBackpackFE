import { useQueryClient } from '@tanstack/react-query';
import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { deleteSubmission, downloadSubmissionFile, fetchSubmissions, SubmissionDto } from '../../../src/api/submissions';
import { useAuth } from '../../../src/store/auth';

type Props = {
  assignmentId: number;
};

const StudentSubmissionCard: React.FC<Props> = ({ assignmentId }) => {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [submission, setSubmission] = useState<SubmissionDto | null>(null);

  const loadSubmission = async () => {
    const data = await fetchSubmissions(assignmentId);
    const studentSubmission = data.find((sub) => sub.studentId === user?.id) ?? null;
    setSubmission(studentSubmission);
  };

  useEffect(() => {
    loadSubmission();
  }, []);

  const handleDownload = async (fileId: number, fileName: string) => {
    try {
      await downloadSubmissionFile(submission!.id, fileId, fileName);
    } catch (error) {
      console.error('Download failed:', error);
    }
  };

  const handleRevoke = async () => {
    try {
      await deleteSubmission(submission!.id);
      setSubmission(null);
      queryClient.invalidateQueries(); // refreshes related data
    } catch (error) {
      console.error('Failed to revoke submission:', error);
    }
  };

  if (!submission) {
    return (
      <Text style={styles.noSubmissionText}>You have not submitted this assignment yet.</Text>
    );
  }

  return (
    <View style={styles.card}>
      <Text style={styles.title}>Your Submission</Text>
      <Text style={styles.date}>Submitted on: {new Date(submission.submittedAt).toLocaleDateString()}</Text>

      {submission.description ? (
        <Text style={styles.description}>📝 {submission.description}</Text>
      ) : null}

      {submission.files && submission.files.length > 0 ? (
        submission.files.map((file) => (
          <View key={file.id} style={styles.fileRow}>
            <Text style={styles.fileName}>📄 {file.fileName}</Text>
            <TouchableOpacity
              style={styles.downloadButton}
              onPress={() => handleDownload(file.id, file.fileName)}
            >
              <Text style={styles.downloadButtonText}>Download</Text>
            </TouchableOpacity>
          </View>
        ))
      ) : (
        <Text style={styles.noFilesText}>No files uploaded.</Text>
      )}

      <TouchableOpacity
        style={styles.revokeButton}
        onPress={handleRevoke}
      >
        <Text style={styles.revokeButtonText}>Revoke Submission</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginTop: 16,
    borderColor: '#E0E0E0',
    borderWidth: 1,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
  },
  title: {
    fontWeight: 'bold',
    fontSize: 16,
    color: '#124E57',
    marginBottom: 4,
  },
  date: {
    fontSize: 12,
    color: '#555',
    marginBottom: 6,
  },
  description: {
    fontSize: 14,
    color: '#333',
    marginBottom: 8,
  },
  fileRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  fileName: {
    flex: 1,
    color: '#124E57',
    fontSize: 14,
  },
  downloadButton: {
    backgroundColor: '#15808D',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 16,
  },
  downloadButtonText: {
    color: '#fff',
    fontWeight: '600',
  },
  revokeButton: {
    backgroundColor: '#D32F2F',
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 16,
    alignItems: 'center',
    marginTop: 10,
  },
  revokeButtonText: {
    color: '#fff',
    fontWeight: '600',
  },
  noSubmissionText: {
    fontSize: 14,
    color: '#777',
    marginTop: 12,
    textAlign: 'center',
  },
  noFilesText: {
    fontSize: 13,
    color: '#555',
    marginTop: 4,
  },
});

export default StudentSubmissionCard;
