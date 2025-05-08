import React from 'react';
import { StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

type Props = {
    isVisible: boolean;
    onClose: () => void;
    onSubmit: (formData: {
        name: string;
        address: string;
        city: string;
        country: string;
    }) => void;
};

export default function AddSchoolModal({ isVisible, onClose, onSubmit }: Props) {
    const [schoolName, setSchoolName] = React.useState('');
    const [schoolAddress, setSchoolAddress] = React.useState('');
    const [schoolCity, setSchoolCity] = React.useState('');
    const [schoolCountry, setSchoolCountry] = React.useState('');

    const handleSubmit = () => {
        // 🚨 Basic validation (optional)
        if (!schoolName.trim()) {
            alert('Please enter a school name.');
            return;
        }

        onSubmit({
            name: schoolName,
            address: schoolAddress,
            city: schoolCity,
            country: schoolCountry,
        });

        // Reset the form
        setSchoolName('');
        setSchoolAddress('');
        setSchoolCity('');
        setSchoolCountry('');
    };

    return (
        <View style={[styles.modalOverlay, !isVisible && styles.hidden]}>
            <View style={styles.modalContent}>
                <Text style={styles.modalHeader}>Add New School</Text>
                <TextInput
                    style={styles.modalInput}
                    placeholder="School Name"
                    value={schoolName}
                    onChangeText={setSchoolName}
                />
                <TextInput
                    style={styles.modalInput}
                    placeholder="Address"
                    value={schoolAddress}
                    onChangeText={setSchoolAddress}
                />
                <TextInput
                    style={styles.modalInput}
                    placeholder="City"
                    value={schoolCity}
                    onChangeText={setSchoolCity}
                />
                <TextInput
                    style={styles.modalInput}
                    placeholder="Country"
                    value={schoolCountry}
                    onChangeText={setSchoolCountry}
                />
                <View style={styles.modalButtons}>
                    <TouchableOpacity
                        style={[styles.modalButton, { backgroundColor: '#15808D' }]}
                        onPress={handleSubmit}
                    >
                        <Text style={styles.modalButtonText}>Submit</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={[styles.modalButton, { backgroundColor: '#F15A22' }]}
                        onPress={onClose}
                    >
                        <Text style={styles.modalButtonText}>Cancel</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    modalOverlay: {
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        backgroundColor: 'rgba(0,0,0,0.5)',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 10,
    },
    hidden: {
        display: 'none',
    },
    modalContent: {
        width: '80%',
        backgroundColor: '#fff',
        borderRadius: 12,
        padding: 20,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 4,
        elevation: 5,
    },
    modalHeader: {
        fontSize: 22,
        fontWeight: 'bold',
        color: '#124E57',
        marginBottom: 16,
        textAlign: 'center',
    },
    modalInput: {
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 8,
        padding: 10,
        marginBottom: 12,
    },
    modalButtons: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        marginTop: 12,
    },
    modalButton: {
        flex: 1,
        paddingVertical: 10,
        marginHorizontal: 5,
        borderRadius: 8,
        alignItems: 'center',
    },
    modalButtonText: {
        color: '#fff',
        fontWeight: 'bold',
    },
});
