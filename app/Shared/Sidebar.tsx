import { usePathname, useRouter } from 'expo-router';
import React, { useMemo } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useAuth } from '../../src/store/auth';

type SidebarProps = {
    onLogout: () => void;
};

const Sidebar: React.FC<SidebarProps> = ({ onLogout }) => {
    const router = useRouter();
    const pathname = usePathname();
    const user = useAuth((state) => state.user);

    const items = useMemo(() => {
        if (!user) return [];
        ////
        console.log('Sidebar user:', user);
        ////
        switch (user.role) {
            case 'SYSTEM_ADMIN':
                return [
                    { label: 'Dashboard', icon: '🏠', path: '/home-sysadmin' },
                    { label: 'Schools', icon: '🏫', path: '/Schools/schools' },
                    { label: 'Users', icon: '👥', path: '/users' },
                ];
            case 'SCHOOL_ADMIN':
                return [
                    { label: 'Dashboard', icon: '🏠', path: '/home-schooladmin' },
                    { label: 'Teachers', icon: '👨‍🏫', path: '/Teachers/teachers' },
                    { label: 'Students', icon: '🎓', path: '/Students/students' },
                    { label: 'Classrooms', icon: '📘', path: '/Classrooms/classrooms' },
                    { label: 'Subjects', icon: '📚', path: '/Subjects/subjects' },
                    { label: 'Schedules', icon: '🗓️', path: '/Schedules/schedules' },
                ];
            case 'TEACHER':
                return [
                    { label: 'Dashboard', icon: '🏠', path: '/home-teacher' },
                    { label: 'Classrooms', icon: '📘', path: '/Classrooms/classrooms' },
                    { label: 'Materials', icon: '📚', path: '/LearningMaterials/learningMaterials' }, // optional/future
                    { label: 'Assignments', icon: '📝', path: '/Assignments/assignments' }, // optional/future
                ];
            case 'STUDENT':
                return [
                    { label: 'Dashboard', icon: '🏠', path: '/home-student' },
                    { label: 'My Classes', icon: '📘', path: '/student-classes' }, // optional/future
                    { label: 'Materials', icon: '📚', path: '/student-materials' },
                    { label: 'Assignments', icon: '📝', path: '/Assignments/assignments' }, // optional/future
                ];
            default:
                return [];
        }

    }, [user]);

    return (
        <View style={styles.sidebar}>
            <Text style={styles.sidebarHeader}>DigiBackpack</Text>

            {items.map((item) => {
                const isActive = pathname === item.path;

                return (
                    <TouchableOpacity
                        key={item.path}
                        style={[styles.sidebarItem, isActive && styles.activeSidebarItem]}
                        onPress={() => router.replace({ pathname: item.path as any })}
                    >
                        <Text style={[styles.sidebarText, isActive && styles.activeSidebarText]}>
                            {item.icon} {item.label}
                        </Text>
                    </TouchableOpacity>
                );
            })}

            <View style={{ flex: 1 }} />

            <TouchableOpacity
                style={styles.sidebarItem}
                onPress={onLogout}
            >
                <Text style={styles.sidebarText}>🚪 Logout</Text>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    sidebar: {
        width: '15%',
        backgroundColor: '#124E57',
        padding: 16,
    },
    sidebarHeader: {
        color: '#FFFFFF',
        fontSize: 22,
        fontWeight: 'bold',
        marginBottom: 24,
        textAlign: 'center',
    },
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

export default Sidebar;
