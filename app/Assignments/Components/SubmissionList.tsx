// src/assignments/Components/SubmissionList.tsx
import React, { useEffect, useState } from 'react';
import { Button, FlatList, Text, View } from 'react-native';
import { deleteSubmission, downloadSubmission, fetchSubmissions, SubmissionDto } from '../../../src/api/submissions';
import { useAuth } from '../../../src/store/auth';

type Props = {
  assignmentId: number;
};

const SubmissionList: React.FC<Props> = ({ assignmentId }) => {
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
  }, []);

  return (
    <View>
      <FlatList
        data={submissions}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View style={{ marginBottom: 10 }}>
            <Text>{item.fileName}</Text>
            <Button title="Download" onPress={() => downloadSubmission(item.id)} />
            {user?.role === 'STUDENT' && (
              <Button title="Delete" color="red" onPress={async () => {
                await deleteSubmission(item.id);
                load();
              }} />
            )}
          </View>
        )}
      />
    </View>
  );
};

export default SubmissionList;
