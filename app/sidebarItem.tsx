import React from 'react';
import { StyleSheet, Text, TouchableOpacity } from 'react-native';

type SidebarItemProps = {
    label: string;
    icon: string;
    path: string;
    currentPath: string;
    onPress: () => void;
};

const SidebarItem: React.FC<SidebarItemProps> = ({ label, icon, path, currentPath, onPress }) => {
    const isActive = currentPath === path;

    return (
        <TouchableOpacity
            style={[styles.sidebarItem, isActive && styles.activeSidebarItem]}
            onPress={onPress}
        >
            <Text style={[styles.sidebarText, isActive && styles.activeSidebarText]}>
                {icon} {label}
            </Text>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    sidebarItem: {
        paddingVertical: 12,
    },
    sidebarText: {
        color: '#FFFFFF',
        fontSize: 18,
    },
    activeSidebarItem: {
        backgroundColor: '#15808D',
        borderRadius: 8,
        paddingVertical: 12,
        paddingHorizontal: 8,
        marginBottom: 8,
    },
    activeSidebarText: {
        fontWeight: 'bold',
    },
});

export default SidebarItem;
