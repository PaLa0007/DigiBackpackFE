import { Picker } from '@react-native-picker/picker';
import React, { useEffect, useState } from 'react';
import {
    Alert,
    Button,
    ScrollView,
    StyleSheet,
    Text,
    View
} from 'react-native';

import { Classroom, fetchSchoolClassrooms } from '../../src/api/classrooms';
import { Schedule, deleteSchedule, fetchScheduleForStudent, fetchScheduleForTeacher, fetchSchedulesByGrade } from '../../src/api/schedules';
import { useAuth } from '../../src/store/auth';
import Sidebar from '../Shared/Sidebar';
import ScheduleFormModal from './Components/scheduleFormModal';

const Schedules = () => {
    const { user } = useAuth();
    const [classrooms, setClassrooms] = useState<Classroom[]>([]);
    const [selectedGrade, setSelectedGrade] = useState<string>('');
    const [selectedClassroom, setSelectedClassroom] = useState<Classroom | null>(null);
    const [schedules, setSchedules] = useState<Schedule[]>([]);
    const [showModal, setShowModal] = useState(false);
    const [editItem, setEditItem] = useState<Schedule | null>(null);

    const daysOfWeek = ['MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY'];

    useEffect(() => {
        const loadClassrooms = async () => {
            if (!user) return;
            if (user.role !== 'SCHOOL_ADMIN') return;

            if (user.schoolId) {
                const cls = await fetchSchoolClassrooms(user.schoolId);
                setClassrooms(cls);

                const allGrades = Array.from(new Set(cls.map((c) => c.grade)));
                if (allGrades.length > 0) {
                    setSelectedGrade(allGrades[0].toString());
                }
            }
        };

        loadClassrooms();
    }, [user]);

    useEffect(() => {
        const loadSchedulesForUser = async () => {
            if (!user) return;

            if (user.role === 'STUDENT') {
                if (!user.id) return;
                const data = await fetchScheduleForStudent(user.id);
                setSchedules(data);
            } else if (user.role === 'TEACHER') {
                if (!user.id) return;
                const data = await fetchScheduleForTeacher(user.id);
                setSchedules(data);
            } else if (user.role === 'SCHOOL_ADMIN' && selectedGrade) {
                const data = await fetchSchedulesByGrade(selectedGrade);
                setSchedules(data);
            }
        };

        loadSchedulesForUser();
    }, [user, selectedGrade]);

    const handleDelete = async (id: number) => {
        Alert.alert('Confirm', 'Delete this schedule block?', [
            { text: 'Cancel', style: 'cancel' },
            {
                text: 'Delete',
                style: 'destructive',
                onPress: async () => {
                    await deleteSchedule(id);
                    if (user?.role === 'SCHOOL_ADMIN' && selectedGrade) {
                        const data = await fetchSchedulesByGrade(selectedGrade);
                        setSchedules(data);
                    }
                },
            },
        ]);
    };

    const schedulesByDay = daysOfWeek.reduce((acc, day) => {
        acc[day] = schedules.filter(s => s.dayOfWeek === day)
            .sort((a, b) => a.startTime.localeCompare(b.startTime));
        return acc;
    }, {} as { [key: string]: Schedule[] });

    const gradeOptions = Array.from(new Set(classrooms.map((c) => c.grade)));
    const filteredClassrooms = classrooms.filter((c) => c.grade.toString() === selectedGrade);

    return (
        <View style={styles.container}>
            <Sidebar onLogout={() => { }} />

            <View style={styles.mainContent}>
                <View style={styles.headerRow}>
                    <Text style={styles.header}>Schedules</Text>
                </View>

                {user?.role === 'SCHOOL_ADMIN' && (
                    <>
                        <Text style={styles.label}>Select Grade</Text>
                        <Picker
                            selectedValue={selectedGrade}
                            onValueChange={(grade) => {
                                setSelectedGrade(grade);
                                setSelectedClassroom(null);
                                setSchedules([]);
                            }}
                            style={styles.picker}
                        >
                            {gradeOptions.map((g) => (
                                <Picker.Item key={g} label={g.toString()} value={g.toString()} />
                            ))}
                        </Picker>
                    </>
                )}

                {user?.role === 'SCHOOL_ADMIN' ? (
                    filteredClassrooms.map((cls) => (
                        <View key={cls.id} style={styles.classroomBlock}>
                            <View style={styles.classroomHeader}>
                                <Text style={styles.classroomTitle}>{cls.name}</Text>
                                <Button
                                    title="Add Schedule"
                                    onPress={() => {
                                        setSelectedClassroom(cls);
                                        setEditItem(null);
                                        setShowModal(true);
                                    }}
                                    color="#15808D"
                                />
                            </View>
                            {/* You can keep the FlatList here if needed for admin */}
                        </View>
                    ))
                ) : (
                    <View style={styles.scheduleWrapper}>
                        <ScrollView
                            horizontal
                            contentContainerStyle={styles.scheduleGridContainer}
                        >
                            {daysOfWeek.map((day) => (
                                <View key={day} style={styles.dayColumn}>
                                    <Text style={styles.dayHeader}>{day}</Text>
                                    {schedulesByDay[day].length > 0 ? (
                                        schedulesByDay[day].map((item) => (
                                            <View key={item.id} style={styles.scheduleItem}>
                                                <Text style={styles.scheduleText}>{item.startTime}–{item.endTime}</Text>
                                                <Text style={styles.scheduleText}>{item.subjectName} - {item.teacherName}</Text>
                                                <Text style={styles.scheduleText}>Classroom: {item.classroomName}</Text>
                                            </View>
                                        ))
                                    ) : (
                                        <Text style={styles.noClassesText}>No Classes</Text>
                                    )}
                                </View>
                            ))}
                        </ScrollView>
                    </View>
                )}
            </View>

            <ScheduleFormModal
                visible={showModal}
                onClose={() => {
                    setShowModal(false);
                    setEditItem(null);
                }}
                classroom={selectedClassroom}
                schedule={editItem}
                onSaved={async () => {
                    if (user?.role === 'SCHOOL_ADMIN' && selectedGrade) {
                        const data = await fetchSchedulesByGrade(selectedGrade);
                        setSchedules(data);
                    }
                    setShowModal(false);
                    setEditItem(null);
                }}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, flexDirection: 'row' },
    mainContent: { flex: 1, backgroundColor: '#fff', padding: 16 },
    headerRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 16 },
    header: { fontSize: 26, fontWeight: 'bold', color: '#124E57' },
    label: { fontWeight: 'bold', marginBottom: 6, color: '#124E57' },
    picker: { marginBottom: 12 },
    classroomBlock: { marginBottom: 24 },
    classroomHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 8,
    },
    classroomTitle: { fontSize: 18, fontWeight: 'bold', color: '#15808D' },
    scheduleWrapper: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    scheduleGridContainer: {
        flexDirection: 'row',
        justifyContent: 'center',  // center columns in the ScrollView
        gap: 12,                   // if supported, or use margin in dayColumn
        paddingVertical: 12,
    },
    scheduleGridContent: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    dayColumn: {
        backgroundColor: '#f2f2f2',
        borderRadius: 8,
        padding: 16,              // slightly larger padding
        marginHorizontal: 12,     // more balanced spacing
        alignItems: 'center',
        width: 200,               // wider columns
        maxWidth: 250,
    },
    dayHeader: {
        fontSize: 16,
        fontWeight: 'bold',
        textAlign: 'center',
        marginBottom: 6,
        color: '#124E57',
    },
    scheduleItem: {
        borderBottomWidth: 1,
        borderColor: '#ccc',
        paddingVertical: 6,
    },
    scheduleText: {
        fontSize: 14,
        textAlign: 'center', // center text within each card
    },
    noClassesText: {
        textAlign: 'center',
        color: '#888',
        fontSize: 14,
        marginTop: 4,
    },
});

export default Schedules;
