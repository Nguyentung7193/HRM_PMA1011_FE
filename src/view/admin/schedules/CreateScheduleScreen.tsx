import React, {useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Alert,
  ActivityIndicator,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Icon from 'react-native-vector-icons/Ionicons';
import {
  CreateScheduleDay,
  CreateScheduleRequest,
  CreateScheduleShift,
  createSchedule,
} from '../../../service/api/ApiService';
import metrics from '../../../constants/metrics';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {RootStackParamList} from '../../../navigation/type';

type Props = NativeStackScreenProps<RootStackParamList, 'CreateScheduleScreen'>;

const CreateScheduleScreen = ({navigation}: Props) => {
  const [loading, setLoading] = useState(false);
  const [schedule, setSchedule] = useState<CreateScheduleRequest>(() => {
    const nextWeekStart = new Date();
    nextWeekStart.setDate(nextWeekStart.getDate() + 7 - nextWeekStart.getDay());

    const nextWeekEnd = new Date(nextWeekStart);
    nextWeekEnd.setDate(nextWeekEnd.getDate() + 6);

    const days: CreateScheduleDay[] = [];
    for (let i = 0; i < 7; i++) {
      const date = new Date(nextWeekStart);
      date.setDate(date.getDate() + i);
      days.push({
        date: date.toISOString().split('T')[0],
        shifts: {
          morning: [{employeeId: '', name: '', position: ''}],
          afternoon: [{employeeId: '', name: '', position: ''}],
        },
      });
    }

    return {
      weekStart: nextWeekStart.toISOString().split('T')[0],
      weekEnd: nextWeekEnd.toISOString().split('T')[0],
      days,
    };
  });

  const handleSubmit = async () => {
    try {
      setLoading(true);
      const token = await AsyncStorage.getItem('auth_token');
      if (!token) {
        navigation.replace('SignInScreen');
        return;
      }

      await createSchedule(token, schedule);
      Alert.alert('Thành công', 'Tạo lịch làm việc thành công', [
        {
          text: 'OK',
          onPress: () => navigation.goBack(),
        },
      ]);
    } catch (err) {
      Alert.alert('Lỗi', 'Không thể tạo lịch làm việc');
    } finally {
      setLoading(false);
    }
  };

  const updateShift = (
    dayIndex: number,
    shift: 'morning' | 'afternoon',
    employeeIndex: number,
    field: keyof CreateScheduleShift,
    value: string,
  ) => {
    const newSchedule = {...schedule};
    newSchedule.days[dayIndex].shifts[shift][employeeIndex][field] = value;
    setSchedule(newSchedule);
  };

  const addEmployee = (dayIndex: number, shift: 'morning' | 'afternoon') => {
    const newSchedule = {...schedule};
    newSchedule.days[dayIndex].shifts[shift].push({
      employeeId: '',
      name: '',
      position: '',
    });
    setSchedule(newSchedule);
  };

  const removeEmployee = (
    dayIndex: number,
    shift: 'morning' | 'afternoon',
    employeeIndex: number,
  ) => {
    const newSchedule = {...schedule};
    newSchedule.days[dayIndex].shifts[shift].splice(employeeIndex, 1);
    setSchedule(newSchedule);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('vi-VN', {
      weekday: 'long',
      day: '2-digit',
      month: '2-digit',
    });
  };

  return (
    <View style={styles.container}>
      <ScrollView>
        <View style={styles.header}>
          <Text style={styles.headerText}>Tạo lịch làm việc tuần tới</Text>
          <Text style={styles.dateRange}>
            {formatDate(schedule.weekStart)} - {formatDate(schedule.weekEnd)}
          </Text>
        </View>

        {schedule.days.map((day, dayIndex) => (
          <View key={dayIndex} style={styles.dayContainer}>
            <Text style={styles.dayTitle}>{formatDate(day.date)}</Text>

            {/* Ca sáng */}
            <View style={styles.shiftContainer}>
              <Text style={styles.shiftTitle}>
                <Icon name="sunny-outline" size={16} color="#666" /> Ca sáng
              </Text>
              {day.shifts.morning.map((employee, empIndex) => (
                <View key={empIndex} style={styles.employeeInputs}>
                  <TextInput
                    style={[styles.input, {flex: 2}]}
                    placeholder="Tên nhân viên"
                    value={employee.name}
                    onChangeText={text =>
                      updateShift(dayIndex, 'morning', empIndex, 'name', text)
                    }
                  />
                  <TextInput
                    style={[styles.input, {flex: 1}]}
                    placeholder="Mô tả"
                    value={employee.position}
                    onChangeText={text =>
                      updateShift(
                        dayIndex,
                        'morning',
                        empIndex,
                        'position',
                        text,
                      )
                    }
                  />
                  {day.shifts.morning.length > 1 && (
                    <TouchableOpacity
                      onPress={() =>
                        removeEmployee(dayIndex, 'morning', empIndex)
                      }>
                      <Icon name="close-circle" size={24} color="#F44336" />
                    </TouchableOpacity>
                  )}
                </View>
              ))}
              <TouchableOpacity
                style={styles.addButton}
                onPress={() => addEmployee(dayIndex, 'morning')}>
                <Icon name="add-circle" size={24} color="#2196F3" />
                <Text style={styles.addButtonText}>Thêm nhân viên</Text>
              </TouchableOpacity>
            </View>

            {/* Ca chiều */}
            <View style={styles.shiftContainer}>
              <Text style={styles.shiftTitle}>
                <Icon name="moon-outline" size={16} color="#666" /> Ca chiều
              </Text>
              {day.shifts.afternoon.map((employee, empIndex) => (
                <View key={empIndex} style={styles.employeeInputs}>
                  <TextInput
                    style={[styles.input, {flex: 2}]}
                    placeholder="Tên nhân viên"
                    value={employee.name}
                    onChangeText={text =>
                      updateShift(dayIndex, 'afternoon', empIndex, 'name', text)
                    }
                  />
                  <TextInput
                    style={[styles.input, {flex: 1}]}
                    placeholder="Mô tả"
                    value={employee.position}
                    onChangeText={text =>
                      updateShift(
                        dayIndex,
                        'afternoon',
                        empIndex,
                        'position',
                        text,
                      )
                    }
                  />
                  {day.shifts.afternoon.length > 1 && (
                    <TouchableOpacity
                      onPress={() =>
                        removeEmployee(dayIndex, 'afternoon', empIndex)
                      }>
                      <Icon name="close-circle" size={24} color="#F44336" />
                    </TouchableOpacity>
                  )}
                </View>
              ))}
              <TouchableOpacity
                style={styles.addButton}
                onPress={() => addEmployee(dayIndex, 'afternoon')}>
                <Icon name="add-circle" size={24} color="#2196F3" />
                <Text style={styles.addButtonText}>Thêm nhân viên</Text>
              </TouchableOpacity>
            </View>
          </View>
        ))}

        <TouchableOpacity
          style={[styles.submitButton, loading && styles.disabledButton]}
          onPress={handleSubmit}
          disabled={loading}>
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.submitButtonText}>Tạo lịch làm việc</Text>
          )}
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    padding: metrics.s(16),
  },
  header: {
    marginBottom: metrics.vs(20),
  },
  headerText: {
    fontSize: metrics.ms(20),
    fontWeight: 'bold',
    color: '#333',
  },
  dateRange: {
    fontSize: metrics.ms(14),
    color: '#666',
    marginTop: metrics.vs(4),
  },
  dayContainer: {
    backgroundColor: '#fff',
    borderRadius: metrics.ms(12),
    padding: metrics.s(16),
    marginBottom: metrics.vs(16),
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 1},
    shadowOpacity: 0.22,
    shadowRadius: 2.22,
  },
  dayTitle: {
    fontSize: metrics.ms(16),
    fontWeight: '600',
    color: '#333',
    marginBottom: metrics.vs(12),
  },
  shiftContainer: {
    marginBottom: metrics.vs(16),
  },
  shiftTitle: {
    fontSize: metrics.ms(14),
    fontWeight: '500',
    color: '#666',
    marginBottom: metrics.vs(8),
  },
  employeeInputs: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: metrics.s(8),
    marginBottom: metrics.vs(8),
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: metrics.ms(8),
    padding: metrics.s(8),
    fontSize: metrics.ms(14),
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: metrics.s(8),
    marginTop: metrics.vs(8),
  },
  addButtonText: {
    color: '#2196F3',
    fontSize: metrics.ms(14),
  },
  submitButton: {
    backgroundColor: '#2196F3',
    padding: metrics.s(16),
    borderRadius: metrics.ms(8),
    alignItems: 'center',
    marginTop: metrics.vs(20),
    marginBottom: metrics.vs(40),
  },
  disabledButton: {
    opacity: 0.7,
  },
  submitButtonText: {
    color: '#fff',
    fontSize: metrics.ms(16),
    fontWeight: '600',
  },
});

export default CreateScheduleScreen;
