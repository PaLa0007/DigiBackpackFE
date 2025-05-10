import { useQuery } from '@tanstack/react-query';
import React, { useEffect } from 'react';
import { Button, FlatList, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { fetchSchoolById } from '../../../src/api/schools';
import { deleteSchoolAdmin, fetchSchoolAdmins } from '../../../src/api/users';


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
    onEditAdmin: (admin: any) => void;
    onAdminsRefetch?: (refetchFn: () => void) => void;
    onSchoolRefetch?: (refetchFn: () => void) => void;
};

const ManageSchoolModal: React.FC<ManageSchoolModalProps> = ({
    school,
    isVisible,
    onClose,
    onEdit,
    onRegisterAdmin,
    onDelete,
    onEditAdmin,
    onAdminsRefetch,
    onSchoolRefetch
}) => {

    const { data: schoolDetails, refetch: refetchSchool } = useQuery({
        queryKey: ['schoolDetails', school.id],
        queryFn: () => fetchSchoolById(school.id),
        enabled: isVisible && !!school,
    });

    // ✅ Query for admins, now fully typed
    const { data: admins, isLoading, error, refetch } = useQuery<Admin[]>({
        queryKey: ['schoolAdmins', school?.id],
        queryFn: () => fetchSchoolAdmins(school.id),
        enabled: isVisible && !!school,
    });

    // ✅ Notify the parent about the refetch function
    useEffect(() => {
        if (isVisible && onAdminsRefetch) {
            onAdminsRefetch(refetch);  // ✅ Pass the refetch function!
        }
    }, [isVisible, onAdminsRefetch, refetch]);

    useEffect(() => {
        if (isVisible && onSchoolRefetch) {
            onSchoolRefetch(refetchSchool);  // ✅ Pass back the refetch function
        }
    }, [isVisible, onSchoolRefetch, refetchSchool]);

    // ✅ Local delete handler INSIDE the component
    const handleDeleteAdmin = async (adminId: number) => {
        try {
            console.log('Deleting admin with ID:', adminId);  // Debugging info
            await deleteSchoolAdmin(adminId);
            alert('Admin deleted successfully!');
            refetch();  // 🚀 auto-refresh the admin list
        } catch (error) {
            console.error('Failed to delete admin:', error);
            alert('Failed to delete admin.');
        }
    };

    // ✅ Hide if not visible
    if (!isVisible || !school) return null;

    return (
        <View style={styles.modalContainer}>
            <Text style={styles.modalHeader}>Manage School: {school.name}</Text>

            {/* School Info */}
            <View style={styles.section}>
                <Text style={styles.sectionTitle}>🏫 School Info:</Text>
                <Text>- Name: {schoolDetails?.name ?? school.name}</Text>
                <Text>- Address: {schoolDetails?.address ?? school.address}</Text>
                <Text>- City: {schoolDetails?.city ?? school.city}</Text>
                <Text>- Country: {schoolDetails?.country ?? school.country}</Text>
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
                            <View style={styles.adminRow}>
                                <Text>
                                    {item.firstName} {item.lastName} ({item.email})
                                </Text>
                                <View style={styles.adminActions}>
                                    <TouchableOpacity onPress={() => onEditAdmin(item)}>
                                        <Text style={styles.editText}>✏️ Edit</Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity onPress={() => handleDeleteAdmin(item.id)}>
                                        <Text style={styles.deleteText}>🗑️ Delete</Text>
                                    </TouchableOpacity>
                                </View>
                            </View>
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
    adminRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 8,
    },
    adminActions: {
        flexDirection: 'row',
        gap: 12,
    },
    editText: {
        color: '#15808D',
        fontWeight: 'bold',
    },
    deleteText: {
        color: '#F15A22',
        fontWeight: 'bold',
    },

});

export default ManageSchoolModal;
