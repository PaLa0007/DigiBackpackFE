import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

type School = {
    id: number;
    name: string;
    address: string;
    city: string;
    country: string;
};

type SchoolCardProps = {
    school: School;
    onManage: () => void;
};

const SchoolCard: React.FC<SchoolCardProps> = ({ school, onManage }) => {
    return (
        <View style={styles.card}>
            <Text style={styles.cardTitle}>{school.name}</Text>
            <Text style={styles.cardText}>{school.address}</Text>
            <TouchableOpacity style={styles.manageButton} onPress={onManage}>
                <Text style={styles.manageButtonText}>Manage</Text>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    card: {
        backgroundColor: '#E0F7FA',
        padding: 16,
        borderRadius: 8,
        marginBottom: 12,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.15,
        shadowRadius: 4,
        elevation: 3,
    },
    cardTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#124E57',
        marginBottom: 4,
    },
    cardText: {
        color: '#124E57',
        marginBottom: 8,
    },
    manageButton: {
        backgroundColor: '#15808D',
        paddingVertical: 8,
        borderRadius: 6,
        alignItems: 'center',
    },
    manageButtonText: {
        color: '#FFFFFF',
        fontWeight: 'bold',
    },
});

export default SchoolCard;
