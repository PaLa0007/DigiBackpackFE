import { useQuery } from '@tanstack/react-query';
import React from 'react';
import { Button, FlatList, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { fetchSchoolAdmins } from '../src/api/users';

// ✅ Define Admin type
type Admin = {
    id: number;
    username: string;
    email: string;
    firstName: string;
    lastName: string;
};

// ✅ Define the props for the modal
type ManageSchoolModalProps = {
    school: {
        id: number;
        name: string;
        address: string;
        city: string;
        country: string;
    };
    isVisible: boolean;
    onClose: () => void;
    onEdit: () => void;
    onRegisterAdmin: () => void;
    onDelete: () => void;
};

const ManageSchoolModal: React.FC<ManageSchoolModalProps> = ({
    school,
    isVisible,
    onClose,
    onEdit,
    onRegisterAdmin,
    onDelete
}) => {

    // ✅ Query for admins, now fully typed
    const { data: admins, isLoading, error } = useQuery<Admin[]>({
        queryKey: ['schoolAdmins', school?.id],
        queryFn: () => fetchSchoolAdmins(school.id),
        enabled: isVisible && !!school,
    });

    // ✅ Hide if not visible
    if (!isVisible || !school) return null;

    return (
        <View style={styles.modalContainer}>
            <Text style={styles.modalHeader}>Manage School: {school.name}</Text>

            {/* School Info */}
            <View style={styles.section}>
                <Text style={styles.sectionTitle}>🏫 School Info:</Text>
                <Text>- Name: {school.name}</Text>
                <Text>- Address: {school.address}</Text>
                <Text>- City: {school.city}</Text>
                <Text>- Country: {school.country}</Text>
            </View>

            {/* School Admins */}
            <View style={styles.section}>
                <Text style={styles.sectionTitle}>👥 School Admins:</Text>
                {isLoading ? (
                    <Text>Loading admins...</Text>
                ) : error ? (
                    <Text>Error loading admins.</Text>
                ) : admins && admins.length === 0 ? (
                    <Text>No admins yet.</Text>
                ) : (
                    <FlatList
                        data={admins}
                        keyExtractor={(item) => item.id.toString()}
                        renderItem={({ item }) => (
                            <Text>
                                - {item.firstName} {item.lastName} ({item.email})
                            </Text>
                        )}
                    />
                )}
            </View>

            {/* Action Buttons */}
            <View style={styles.buttonRow}>
                <TouchableOpacity style={styles.actionButton} onPress={onEdit}>
                    <Text style={styles.buttonText}>✏️ Edit School Details</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.actionButton} onPress={onRegisterAdmin}>
                    <Text style={styles.buttonText}>👤 Register New Admin</Text>
                </TouchableOpacity>

                <TouchableOpacity style={[styles.actionButton, { backgroundColor: '#F15A22' }]} onPress={onDelete}>
                    <Text style={styles.buttonText}>🗑️ Delete School</Text>
                </TouchableOpacity>
            </View>

            <Button title="Close" onPress={onClose} color="#124E57" />
        </View>
    );
};

const styles = StyleSheet.create({
    modalContainer: {
        backgroundColor: '#fff',
        padding: 20,
        margin: 20,
        borderRadius: 12,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
        elevation: 5,
    },
    modalHeader: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 16,
        textAlign: 'center',
        color: '#124E57',
    },
    section: {
        marginBottom: 16,
    },
    sectionTitle: {
        fontWeight: 'bold',
        marginBottom: 8,
        color: '#15808D',
    },
    buttonRow: {
        marginTop: 16,
    },
    actionButton: {
        backgroundColor: '#15808D',
        padding: 10,
        borderRadius: 8,
        marginBottom: 8,
        alignItems: 'center',
    },
    buttonText: {
        color: '#fff',
        fontWeight: 'bold',
    },
});

export default ManageSchoolModal;
