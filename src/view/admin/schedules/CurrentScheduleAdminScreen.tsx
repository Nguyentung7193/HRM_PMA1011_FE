/* eslint-disable react-hooks/exhaustive-deps */
import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  Alert,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Icon from 'react-native-vector-icons/Ionicons';
import {
  getCurrentScheduleAdmin,
  ScheduleAdmin,
} from '../../../service/api/ApiService';
import metrics from '../../../constants/metrics';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {RootStackParamList} from '../../../navigation/type';

type Props = NativeStackScreenProps<
  RootStackParamList,
  'CurrentScheduleAdminScreen'
>;

const CurrentScheduleAdminScreen = ({navigation}: Props) => {
  const [loading, setLoading] = useState(true);
  const [schedule, setSchedule] = useState<ScheduleAdmin | null>(null);

  useEffect(() => {
    fetchSchedule();

    const unsubscribe = navigation.addListener('focus', () => {
      fetchSchedule();
    });

    return () => unsubscribe();
  }, [navigation]);

  const fetchSchedule = async () => {
    try {
      setLoading(true);
      const token = await AsyncStorage.getItem('auth_token');
      if (!token) {
        navigation.replace('SignInScreen');
        return;
      }

      const response = await getCurrentScheduleAdmin(token);
      setSchedule(response.data);
    } catch (err) {
      Alert.alert('Lỗi', 'Không thể tải lịch làm việc');
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('vi-VN', {
      weekday: 'long',
      day: '2-digit',
      month: '2-digit',
    });
  };

  if (loading) {
    return (
      <View style={[styles.container, styles.centerContent]}>
        <ActivityIndicator size="large" color="#2196F3" />
      </View>
    );
  }

  if (!schedule) {
    return (
      <View style={[styles.container, styles.centerContent]}>
        <Text style={styles.emptyText}>Admin chưa tạo lịch biểu</Text>
      </View>
    );
  }

  const isCurrentDay = (date: string) => {
    const today = new Date().setHours(0, 0, 0, 0);
    const checkDate = new Date(date).setHours(0, 0, 0, 0);
    return today === checkDate;
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.weekInfo}>
        <Text style={styles.weekTitle}>
          Tuần: {new Date(schedule.weekStart).toLocaleDateString('vi-VN')} -{' '}
          {new Date(schedule.weekEnd).toLocaleDateString('vi-VN')}
        </Text>
      </View>

      {schedule.days.map(day => (
        <View
          key={day.date}
          style={[
            styles.dayContainer,
            isCurrentDay(day.date) && styles.currentDay,
          ]}>
          <Text style={styles.dayTitle}>{formatDate(day.date)}</Text>

          <View style={styles.shiftsContainer}>
            {/* Ca sáng */}
            <View style={styles.shiftSection}>
              <Text style={styles.shiftTitle}>
                <Icon name="sunny-outline" size={16} color="#666" /> Ca sáng
              </Text>
              {day.shifts.morning.map((employee, index) => (
                <View key={index} style={styles.employeeItem}>
                  <Text style={styles.employeeName}>{employee.name}</Text>
                  <Text style={styles.employeePosition}>
                    {employee.position}
                  </Text>
                </View>
              ))}
            </View>

            <View style={styles.shiftDivider} />

            {/* Ca chiều */}
            <View style={styles.shiftSection}>
              <Text style={styles.shiftTitle}>
                <Icon name="moon-outline" size={16} color="#666" /> Ca chiều
              </Text>
              {day.shifts.afternoon.map((employee, index) => (
                <View key={index} style={styles.employeeItem}>
                  <Text style={styles.employeeName}>{employee.name}</Text>
                  <Text style={styles.employeePosition}>
                    {employee.position}
                  </Text>
                </View>
              ))}
            </View>
          </View>
        </View>
      ))}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: metrics.s(16),
    marginTop: metrics.vs(30),
  },
  centerContent: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    fontSize: metrics.ms(16),
    color: '#666',
  },
  weekInfo: {
    marginBottom: metrics.vs(16),
    padding: metrics.s(12),
    backgroundColor: '#E3F2FD',
    borderRadius: metrics.ms(8),
  },
  weekTitle: {
    fontSize: metrics.ms(16),
    fontWeight: '600',
    color: '#2196F3',
    textAlign: 'center',
  },
  dayContainer: {
    marginBottom: metrics.vs(16),
    backgroundColor: '#F5F5F5',
    borderRadius: metrics.ms(8),
    overflow: 'hidden',
  },
  currentDay: {
    borderColor: '#2196F3',
    borderWidth: 2,
  },
  dayTitle: {
    fontSize: metrics.ms(14),
    fontWeight: '500',
    backgroundColor: '#2196F3',
    color: '#fff',
    padding: metrics.s(8),
  },
  shiftsContainer: {
    flexDirection: 'row',
    padding: metrics.s(12),
  },
  shiftSection: {
    flex: 1,
  },
  shiftDivider: {
    width: 1,
    backgroundColor: '#E0E0E0',
    marginHorizontal: metrics.s(12),
  },
  shiftTitle: {
    fontSize: metrics.ms(14),
    fontWeight: '500',
    color: '#666',
    marginBottom: metrics.vs(8),
    flexDirection: 'row',
    alignItems: 'center',
  },
  employeeItem: {
    marginBottom: metrics.vs(8),
    backgroundColor: '#fff',
    padding: metrics.s(8),
    borderRadius: metrics.ms(4),
  },
  employeeName: {
    fontSize: metrics.ms(14),
    color: '#333',
    fontWeight: '500',
  },
  employeePosition: {
    fontSize: metrics.ms(12),
    color: '#666',
    marginTop: metrics.vs(2),
  },
});

export default CurrentScheduleAdminScreen;
