/* eslint-disable curly */
/* eslint-disable react-native/no-inline-styles */
/* eslint-disable react/no-unstable-nested-components */
/* eslint-disable react-hooks/exhaustive-deps */
import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  ActivityIndicator,
  Alert,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Icon from 'react-native-vector-icons/Ionicons';
import {
  AdminAttendanceRecord,
  getAdminAttendance,
} from '../../../service/api/ApiService';
import metrics from '../../../constants/metrics';
import {RootStackParamList} from '../../../navigation/type';
import {NativeStackScreenProps} from '@react-navigation/native-stack';

type Props = NativeStackScreenProps<
  RootStackParamList,
  'AdminAttendanceScreen'
>;

const AdminAttendanceScreen = ({navigation}: Props) => {
  const [loading, setLoading] = useState(true);
  const [records, setRecords] = useState<AdminAttendanceRecord[]>([]);
  const [statistics, setStatistics] = useState({
    totalEmployees: 0,
    averageHoursPerDay: 0,
    presentToday: 0,
  });

  useEffect(() => {
    fetchAttendance();

    const unsubscribe = navigation.addListener('focus', () => {
      fetchAttendance();
    });

    return () => unsubscribe();
  }, [navigation]);

  const fetchAttendance = async () => {
    try {
      setLoading(true);
      const token = await AsyncStorage.getItem('auth_token');
      if (!token) {
        navigation.replace('SignInScreen');
        return;
      }

      const data = await getAdminAttendance(token);
      setRecords(data.records);
      setStatistics(data.statistics);
    } catch (err) {
      Alert.alert('Lỗi', 'Không thể tải danh sách chấm công');
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('vi-VN');
  };

  const formatTime = (timeString: string | null) => {
    if (!timeString) return '--:--';
    return new Date(timeString).toLocaleTimeString('vi-VN', {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const StatisticsCard = () => (
    <View style={styles.statsContainer}>
      <View style={styles.statItem}>
        <Text style={styles.statValue}>{statistics.totalEmployees}</Text>
        <Text style={styles.statLabel}>Tổng nhân viên</Text>
      </View>
      <View style={styles.statDivider} />
      <View style={styles.statItem}>
        <Text style={styles.statValue}>
          {statistics.averageHoursPerDay.toFixed(3)}
        </Text>
        <Text style={styles.statLabel}>Giờ TB/ngày</Text>
      </View>
      <View style={styles.statDivider} />
      <View style={styles.statItem}>
        <Text style={styles.statValue}>{statistics.presentToday}</Text>
        <Text style={styles.statLabel}>Hiện diện</Text>
      </View>
    </View>
  );

  const renderAttendanceItem = ({item}: {item: AdminAttendanceRecord}) => (
    <View style={styles.card}>
      <View style={styles.cardHeader}>
        <Text style={styles.employeeEmail}>{item.employee.email}</Text>
        <Text style={styles.date}>{formatDate(item.date)}</Text>
      </View>

      <View style={styles.timeLogsContainer}>
        {item.timeLogs.map((log, index) => (
          <View key={index} style={styles.timeLogItem}>
            <View style={styles.timeLog}>
              <Icon name="enter-outline" size={16} color="#4CAF50" />
              <Text style={styles.timeText}>
                Vào: {formatTime(log.checkIn)}
              </Text>
            </View>
            <View style={styles.timeLog}>
              <Icon name="exit-outline" size={16} color="#F44336" />
              <Text style={styles.timeText}>
                Ra: {formatTime(log.checkOut)}
              </Text>
            </View>
            <Text style={styles.duration}>{log.duration.toFixed(2)} giờ</Text>
          </View>
        ))}
      </View>

      <View style={styles.cardFooter}>
        <Text style={styles.totalHours}>
          Tổng thời gian: {item.totalHours.toFixed(2)} giờ
        </Text>
        <View
          style={[
            styles.statusBadge,
            {
              backgroundColor:
                item.status === 'completed' ? '#4CAF50' : '#FFC107',
            },
          ]}>
          <Text style={styles.statusText}>
            {item.status === 'completed' ? 'Hoàn thành' : 'Đang làm'}
          </Text>
        </View>
      </View>
    </View>
  );

  if (loading) {
    return (
      <View style={[styles.container, styles.centerContent]}>
        <ActivityIndicator size="large" color="#2196F3" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <StatisticsCard />
      <FlatList
        data={records}
        renderItem={renderAttendanceItem}
        keyExtractor={item => item._id}
        contentContainerStyle={styles.listContainer}
        ListEmptyComponent={
          <Text style={styles.emptyText}>Không có dữ liệu chấm công</Text>
        }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    marginTop: metrics.vs(30),
  },
  centerContent: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  statsContainer: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    margin: metrics.s(16),
    padding: metrics.s(16),
    borderRadius: metrics.ms(12),
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 1},
    shadowOpacity: 0.22,
    shadowRadius: 2.22,
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
  },
  statDivider: {
    width: 1,
    backgroundColor: '#E0E0E0',
  },
  statValue: {
    fontSize: metrics.ms(20),
    fontWeight: 'bold',
    color: '#2196F3',
  },
  statLabel: {
    fontSize: metrics.ms(12),
    color: '#666',
    marginTop: metrics.vs(4),
  },
  listContainer: {
    padding: metrics.s(16),
    gap: metrics.vs(12),
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: metrics.ms(12),
    padding: metrics.s(16),
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 1},
    shadowOpacity: 0.22,
    shadowRadius: 2.22,
  },
  cardHeader: {
    marginBottom: metrics.vs(12),
  },
  employeeEmail: {
    fontSize: metrics.ms(16),
    fontWeight: '600',
    color: '#333',
  },
  date: {
    fontSize: metrics.ms(12),
    color: '#666',
    marginTop: metrics.vs(2),
  },
  timeLogsContainer: {
    gap: metrics.vs(8),
  },
  timeLogItem: {
    backgroundColor: '#F5F5F5',
    padding: metrics.s(8),
    borderRadius: metrics.ms(8),
  },
  timeLog: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: metrics.s(8),
  },
  timeText: {
    fontSize: metrics.ms(14),
    color: '#666',
  },
  duration: {
    fontSize: metrics.ms(12),
    color: '#2196F3',
    fontWeight: '500',
    marginTop: metrics.vs(4),
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: metrics.vs(12),
    paddingTop: metrics.vs(12),
    borderTopWidth: 1,
    borderTopColor: '#E0E0E0',
  },
  totalHours: {
    fontSize: metrics.ms(14),
    fontWeight: '500',
    color: '#333',
  },
  statusBadge: {
    paddingHorizontal: metrics.s(8),
    paddingVertical: metrics.vs(4),
    borderRadius: metrics.ms(12),
  },
  statusText: {
    fontSize: metrics.ms(12),
    color: '#fff',
    fontWeight: '500',
  },
  emptyText: {
    textAlign: 'center',
    fontSize: metrics.ms(16),
    color: '#666',
    marginTop: metrics.vs(20),
  },
});

export default AdminAttendanceScreen;
