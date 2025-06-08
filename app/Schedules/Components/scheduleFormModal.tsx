import { Picker } from '@react-native-picker/picker';
import React, { useEffect, useState } from 'react';
import {
    Button,
    Modal,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    View,
} from 'react-native';
import { Classroom } from '../../../src/api/classrooms';
import { Schedule, createSchedule, updateSchedule } from '../../../src/api/schedules';
import { Subject, fetchSubjectsBySchool } from '../../../src/api/subjects';
import { Teacher, fetchTeachers } from '../../../src/api/teachers';
import { useAuth } from '../../../src/store/auth';

type Props = {
    visible: boolean;
    onClose: () => void;
    classroom: Classroom | null;
    schedule: Schedule | null;
    onSaved: () => void;
};

const daysOfWeek = ['MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY'];

const ScheduleFormModal: React.FC<Props> = ({ visible, onClose, classroom, schedule, onSaved }) => {
    const { user } = useAuth();

    const [dayOfWeek, setDayOfWeek] = useState('MONDAY');
    const [startTime, setStartTime] = useState('08:00');
    const [endTime, setEndTime] = useState('08:45');
    const [subjectId, setSubjectId] = useState<number | string>(''); // instead of null
    const [teacherId, setTeacherId] = useState<number | string>(''); // instead of null

    const [subjects, setSubjects] = useState<Subject[]>([]);
    const [teachers, setTeachers] = useState<Teacher[]>([]);

    useEffect(() => {
        if (user?.schoolId !== undefined) {
            fetchSubjectsBySchool(user.schoolId).then(setSubjects);
        }
        fetchTeachers().then(setTeachers);
    }, [user]);

    useEffect(() => {
        if (schedule) {
            setDayOfWeek(schedule.dayOfWeek);
            setStartTime(schedule.startTime);
            setEndTime(schedule.endTime);
            setSubjectId(schedule.subjectId ?? '');
            setTeacherId(schedule.teacherId ?? '');
        } else {
            setDayOfWeek('MONDAY');
            setStartTime('08:00');
            setEndTime('08:45');
            setSubjectId('');
            setTeacherId('');
        }
    }, [schedule]);


    const handleSave = async () => {
        if (!classroom || subjectId === null || teacherId === null) return;

        const payload: Schedule = {
            dayOfWeek,
            startTime,
            endTime,
            classroomId: classroom.id,
            subjectId: Number(subjectId),
            teacherId: Number(teacherId),
        };

        if (schedule?.id) {
            await updateSchedule(schedule.id, payload);
        } else {
            await createSchedule(payload);
        }

        onSaved();
    };

    return (
        <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
            <View style={styles.overlay}>
                <View style={styles.modal}>
                    <ScrollView>
                        <Text style={styles.title}>{schedule ? 'Edit Schedule' : 'Add Schedule'}</Text>

                        <Text style={styles.label}>Day of Week</Text>
                        <Picker selectedValue={dayOfWeek} onValueChange={setDayOfWeek}>
                            {daysOfWeek.map((day) => (
                                <Picker.Item key={day} label={day} value={day} />
                            ))}
                        </Picker>

                        <Text style={styles.label}>Start Time (HH:mm)</Text>
                        <TextInput
                            style={styles.input}
                            value={startTime}
                            onChangeText={setStartTime}
                            placeholder="08:00"
                        />

                        <Text style={styles.label}>End Time (HH:mm)</Text>
                        <TextInput
                            style={styles.input}
                            value={endTime}
                            onChangeText={setEndTime}
                            placeholder="08:45"
                        />

                        <Text style={styles.label}>Subject</Text>
                        <View style={styles.pickerWrapper}>
                            <Picker selectedValue={subjectId} onValueChange={(v) => setSubjectId(v)}>
                                <Picker.Item label="Select Subject" value="" />
                                {subjects.map((s) => (
                                    <Picker.Item key={s.id} label={s.name} value={s.id.toString()} />
                                ))}
                            </Picker>
                        </View>

                        <Text style={styles.label}>Teacher</Text>
                        <View style={styles.pickerWrapper}>
                            <Picker selectedValue={teacherId} onValueChange={(v) => setTeacherId(v)}>
                                <Picker.Item label="Select Teacher" value="" />
                                {teachers.map((t) => (
                                    <Picker.Item
                                        key={t.id}
                                        label={`${t.firstName} ${t.lastName}`}
                                        value={t.id.toString()}
                                    />
                                ))}
                            </Picker>
                        </View>



                        <View style={styles.buttonRow}>
                            <Button title="Cancel" color="gray" onPress={onClose} />
                            <Button title="Save" onPress={handleSave} />
                        </View>
                    </ScrollView>
                </View>
            </View>
        </Modal>
    );
};

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        justifyContent: 'center',
        backgroundColor: 'rgba(0,0,0,0.4)',
        padding: 16,
    },
    modal: {
        backgroundColor: '#fff',
        padding: 20,
        borderRadius: 12,
        elevation: 10,
    },
    title: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#124E57',
        marginBottom: 16,
        textAlign: 'center',
    },
    label: {
        fontWeight: '600',
        marginTop: 10,
        color: '#333',
    },
    input: {
        borderWidth: 1,
        borderColor: '#ccc',
        padding: 10,
        borderRadius: 8,
        marginTop: 4,
        marginBottom: 12,
    },
    buttonRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 20,
    },
    pickerWrapper: {
        marginBottom: 12,
    },
});

export default ScheduleFormModal;
