import { useRouter } from 'expo-router';
import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';
import { useAuth } from '../src/store/auth';
import { useLogout } from './../src/hooks/useLogout';
import Sidebar from './Shared/Sidebar';

export default function HomeStudent() {
    const user = useAuth((state) => state.user);
    const logout = useLogout();
    const router = useRouter();

    if (!user) {
        return (
            <View style={styles.centered}>
                <ActivityIndicator size="large" color="#F69521" />
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <Sidebar onLogout={logout} />

            <View style={styles.mainContent}>
                <Text style={styles.header}>Welcome, {user.firstName} {user.lastName}!</Text>
                <Text style={styles.subtext}>This is the Student Dashboard.</Text>
                {/* Add dashboard content for students here */}
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'row',
    },
    mainContent: {
        flex: 1,
        backgroundColor: '#FFFFFF',
        padding: 16,
    },
    header: {
        fontSize: 26,
        marginVertical: 16,
        textAlign: 'center',
        fontWeight: 'bold',
        color: '#124E57',
    },
    subtext: {
        fontSize: 16,
        textAlign: 'center',
        color: '#15808D',
    },
    centered: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#124E57',
    },
});