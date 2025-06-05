import React, { useEffect, useState } from 'react';
import { FlatList, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { fetchTeacherClassrooms } from '../../src/api/classrooms';
import { fetchLearningMaterials, LearningMaterialDto } from '../../src/api/learningMaterials';
import { useAuth } from '../../src/store/auth';

import Sidebar from '../Shared/Sidebar';
import LearningMaterialCard from './Components/learningMaterialCard';
import UploadLearningMaterialModal from './Components/uploadLearningMaterialModal';

type ClassroomOption = { id: number; name: string };

const LearningMaterialsScreen: React.FC = () => {
    const [materials, setMaterials] = useState<LearningMaterialDto[]>([]);
    const [showModal, setShowModal] = useState(false);
    const [classroomOptions, setClassroomOptions] = useState<ClassroomOption[]>([]);
    const { user } = useAuth();

    const loadMaterials = async () => {
        const data = await fetchLearningMaterials();
        setMaterials(data);
    };

    const loadClassrooms = async () => {
        if (user?.role === 'TEACHER') {
            const data = await fetchTeacherClassrooms(user.id);
            const options = data.map((cls) => ({
                id: cls.id,
                name: cls.name,
            }));
            setClassroomOptions(options);
        }
    };

    useEffect(() => {
        loadMaterials();
        loadClassrooms();
    }, []);

    if (!user) return null;

    return (
        <View style={styles.container}>
            <Sidebar onLogout={() => console.log('TODO: logout')} />

            <View style={styles.content}>
                {user.role === 'TEACHER' && (
                    <>
                        <TouchableOpacity
                            style={styles.addButton}
                            onPress={() => setShowModal(true)}
                        >
                            <Text style={styles.addButtonText}>Upload Material</Text>
                        </TouchableOpacity>

                        <UploadLearningMaterialModal
                            visible={showModal}
                            onClose={() => setShowModal(false)}
                            uploadedById={user.id}
                            onUploadSuccess={loadMaterials}
                            classroomOptions={classroomOptions}
                        />
                    </>
                )}

                <FlatList
                    data={materials}
                    keyExtractor={(item) => item.id.toString()}
                    renderItem={({ item }) => (
                        <LearningMaterialCard
                            material={item}
                            onDeleted={loadMaterials}
                            currentUserId={user.id}
                        />
                    )}
                    contentContainerStyle={styles.list}
                    ListEmptyComponent={
                        <Text style={{ textAlign: 'center', color: '#666', padding: 20 }}>
                            No learning materials uploaded.
                        </Text>
                    }
                />
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'row',
    },
    content: {
        flex: 1,
        padding: 16,
    },
    list: {
        paddingTop: 10,
    },
    addButton: {
        backgroundColor: '#F15A22',
        paddingVertical: 12,
        paddingHorizontal: 16,
        borderRadius: 8,
        alignItems: 'center',
        marginBottom: 16,
    },
    addButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '600',
    },
});

export default LearningMaterialsScreen;
