import { Picker } from '@react-native-picker/picker';
import React, { useEffect, useState } from 'react';
import {
    Alert,
    Button,
    FlatList,
    StyleSheet,
    Text,
    View
} from 'react-native';

import { Classroom, fetchSchoolClassrooms } from '../../src/api/classrooms';
import { Schedule, deleteSchedule, fetchSchedulesByGrade } from '../../src/api/schedules';
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

    useEffect(() => {
        const loadClassrooms = async () => {
            if (user?.schoolId) {
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
        const loadSchedules = async () => {
            if (selectedGrade) {
                const data = await fetchSchedulesByGrade(selectedGrade);
                setSchedules(data);
            }
        };

        loadSchedules();
    }, [selectedGrade]);

    const handleDelete = async (id: number) => {
        Alert.alert('Confirm', 'Delete this schedule block?', [
            { text: 'Cancel', style: 'cancel' },
            {
                text: 'Delete',
                style: 'destructive',
                onPress: async () => {
                    await deleteSchedule(id);
                    const data = await fetchSchedulesByGrade(selectedGrade);
                    setSchedules(data);
                },
            },
        ]);
    };

    if (user?.role !== 'SCHOOL_ADMIN') {
        return (
            <View style={styles.notAllowedWrapper}>
                <Text style={styles.notAllowed}>You are not authorized to view this screen.</Text>
            </View>
        );
    }

    const gradeOptions = Array.from(new Set(classrooms.map((c) => c.grade)));
    const filteredClassrooms = classrooms.filter((c) => c.grade.toString() === selectedGrade);

    return (
        <View style={styles.container}>
            <Sidebar onLogout={() => { }} />

            <View style={styles.mainContent}>
                <View style={styles.headerRow}>
                    <Text style={styles.header}>Schedules</Text>
                </View>

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

                {filteredClassrooms.map((cls) => (
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

                        <FlatList
                            key={`classroom-${cls.id}`}
                            data={schedules
                                .filter((s) => s.classroomId === cls.id)
                                .slice()
                                .sort((a, b) => {
                                    const days = ['MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY'];
                                    const dayDiff = days.indexOf(a.dayOfWeek) - days.indexOf(b.dayOfWeek);
                                    if (dayDiff !== 0) return dayDiff;
                                    return a.startTime.localeCompare(b.startTime); // compares "08:00" vs "08:45"
                                })}

                            keyExtractor={(item) =>
                                `${item.id}-${item.subjectId}-${item.teacherId}-${item.dayOfWeek}`
                            }
                            renderItem={({ item }) => (
                                <View style={styles.scheduleItem}>
                                    <Text style={styles.scheduleText}>
                                        {item.dayOfWeek} {item.startTime}–{item.endTime}
                                    </Text>
                                    <Text style={styles.scheduleText}>
                                        {item.subjectName} - {item.teacherName}
                                    </Text>
                                    <View style={styles.scheduleActions}>
                                        <Button
                                            title="Edit"
                                            onPress={() => {
                                                setSelectedClassroom(cls);
                                                setEditItem(item);
                                                setShowModal(true);
                                            }}
                                        />
                                        <Button
                                            title="Delete"
                                            onPress={() => handleDelete(item.id!)}
                                            color="#F15A22"
                                        />
                                    </View>
                                </View>
                            )}
                        />
                    </View>
                ))}
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
                    const data = await fetchSchedulesByGrade(selectedGrade);
                    setSchedules(data);
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
    scheduleItem: {
        borderBottomWidth: 1,
        borderColor: '#ccc',
        paddingVertical: 10,
    },
    scheduleText: { fontSize: 16 },
    scheduleActions: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 8,
    },
    notAllowed: {
        padding: 16,
        fontSize: 16,
        color: 'red',
    },
    notAllowedWrapper: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
});

export default Schedules;
