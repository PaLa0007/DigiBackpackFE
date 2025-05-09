import React from 'react';
import { StyleSheet, Text, TextInput, View } from 'react-native';

type SchoolControlsProps = {
    searchQuery: string;
    onSearchChange: (text: string) => void;
    sortOption: string;
    onSortChange: (value: string) => void;
};

const SchoolControls: React.FC<SchoolControlsProps> = ({
    searchQuery,
    onSearchChange,
    sortOption,
    onSortChange,
}) => {
    return (
        <View style={styles.controlsRow}>
            <TextInput
                style={styles.searchInput}
                placeholder="Search schools..."
                value={searchQuery}
                onChangeText={onSearchChange}
            />
            <View style={styles.sortContainer}>
                <Text style={{ marginRight: 8, color: '#124E57' }}>Sort by:</Text>
                <select
                    value={sortOption}
                    onChange={(e) => onSortChange(e.target.value)}
                    style={styles.sortSelect}
                >
                    <option value="name_asc">Name (A-Z)</option>
                    <option value="name_desc">Name (Z-A)</option>
                    <option value="newest">Newest First</option>
                    <option value="oldest">Oldest First</option>
                    <option value="city_asc">City (A-Z)</option>
                    <option value="country_asc">Country (A-Z)</option>
                </select>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    controlsRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 16,
        flexWrap: 'wrap',
    },
    searchInput: {
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 8,
        padding: 8,
        width: '60%',
        marginBottom: 8,
    },
    sortContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        width: '35%',
    },
    sortSelect: {
        padding: 8,
        borderRadius: 8,
        borderColor: '#ccc',
    },
});

export default SchoolControls;
