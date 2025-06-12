/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable react-hooks/exhaustive-deps */
import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  ScrollView,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import metrics from '../../constants/metrics';
import {
  AttendanceRecord,
  checkAttendance,
  getAttendanceHistory,
} from '../../service/api/ApiService';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useNavigation} from '@react-navigation/native';
import {TabScreenNavigationProp} from '../../navigation/type';

const AttendanceScreen = () => {
  const navigation = useNavigation<TabScreenNavigationProp>();
  const [currentTime, setCurrentTime] = useState(new Date());
  const [loading, setLoading] = useState(false);
  const [history, setHistory] = useState<AttendanceRecord[]>([]);
  const [todayRecord, setTodayRecord] = useState<AttendanceRecord | null>(null);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    fetchAttendanceHistory();

    const unsubscribe = navigation.addListener('focus', () => {
      fetchAttendanceHistory();
    });

    return () => {
      clearInterval(timer);
      unsubscribe();
    };
  }, [navigation]);

  const fetchAttendanceHistory = async () => {
    try {
      const token = await AsyncStorage.getItem('auth_token');
      if (!token) {
        navigation.replace('SignInScreen');
        return;
      }
      const data = await getAttendanceHistory(token);
      setHistory(data.records);

      const today = new Date().toISOString().split('T')[0];
      const todayRec = data.records.find(
        record => record.date.split('T')[0] === today,
      );
      setTodayRecord(todayRec || null);
    } catch (err: any) {
      Alert.alert('Lỗi', 'Không thể tải lịch sử chấm công');
    }
  };

  const handleCheck = async () => {
    try {
      setLoading(true);
      const token = await AsyncStorage.getItem('auth_token');
      if (!token) {
        navigation.replace('SignInScreen');
        return;
      }

      await checkAttendance(token);
      await fetchAttendanceHistory();
      Alert.alert('Thành công', 'Chấm công thành công');
    } catch (err: any) {
      Alert.alert('Lỗi', 'Không thể chấm công');
    } finally {
      setLoading(false);
    }
  };

  const formatTime = (dateString: string) => {
    return new Date(dateString).toLocaleTimeString('vi-VN', {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.timeCard}>
        <Text style={styles.currentTime}>
          {currentTime.toLocaleTimeString('vi-VN')}
        </Text>
        <Text style={styles.date}>
          {currentTime.toLocaleDateString('vi-VN')}
        </Text>
      </View>

      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={[styles.checkButton, loading && styles.disabledButton]}
          onPress={handleCheck}
          disabled={loading}>
          {loading ? (
            <ActivityIndicator color="#fff" size="large" />
          ) : (
            <>
              <Icon name="finger-print" size={metrics.ms(32)} color="#fff" />
              <Text style={styles.buttonText}>Chấm công</Text>
            </>
          )}
        </TouchableOpacity>
      </View>

      <View style={styles.historyContainer}>
        <Text style={styles.historyTitle}>Lịch sử chấm công hôm nay</Text>
        {todayRecord ? (
          <>
            <View style={styles.historyItem}>
              <Icon
                name="enter-outline"
                size={metrics.ms(24)}
                color="#4CAF50"
              />
              <Text style={styles.historyText}>
                Vào ca: {formatTime(todayRecord.checkIn)}
              </Text>
            </View>
            {todayRecord.checkOut && (
              <View style={styles.historyItem}>
                <Icon
                  name="exit-outline"
                  size={metrics.ms(24)}
                  color="#FF5722"
                />
                <Text style={styles.historyText}>
                  Ra ca: {formatTime(todayRecord.checkOut)}
                </Text>
              </View>
            )}

            {todayRecord.timeLogs && todayRecord.timeLogs.length > 0 && (
              <View style={styles.timeLogsContainer}>
                <Text style={styles.timeLogsTitle}>
                  Chi tiết các lần chấm công:
                </Text>
                {todayRecord.timeLogs.map((log, index) => (
                  <View key={log._id} style={styles.timeLogItem}>
                    <Text style={styles.timeLogIndex}>Lần {index + 1}:</Text>
                    <View style={styles.timeLogDetails}>
                      <View style={styles.timeLogRow}>
                        <Icon
                          name="enter-outline"
                          size={metrics.ms(16)}
                          color="#4CAF50"
                        />
                        <Text style={styles.timeLogText}>
                          Vào: {formatTime(log.checkIn)}
                        </Text>
                      </View>
                      {log.checkOut && (
                        <View style={styles.timeLogRow}>
                          <Icon
                            name="exit-outline"
                            size={metrics.ms(16)}
                            color="#FF5722"
                          />
                          <Text style={styles.timeLogText}>
                            Ra: {formatTime(log.checkOut)}
                          </Text>
                        </View>
                      )}
                    </View>
                  </View>
                ))}
              </View>
            )}

            <View style={styles.totalHours}>
              <Text style={styles.totalHoursText}>
                Tổng số giờ: {todayRecord.totalHours}h
              </Text>
            </View>
          </>
        ) : (
          <Text style={styles.emptyText}>Chưa có dữ liệu chấm công</Text>
        )}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: metrics.s(16),
  },
  timeCard: {
    alignItems: 'center',
    padding: metrics.s(20),
    backgroundColor: '#E3F2FD',
    borderRadius: metrics.ms(12),
    marginBottom: metrics.vs(24),
  },
  currentTime: {
    fontSize: metrics.ms(32),
    fontWeight: 'bold',
    color: '#2196F3',
  },
  date: {
    fontSize: metrics.ms(16),
    color: '#666',
    marginTop: metrics.vs(8),
  },
  buttonContainer: {
    alignItems: 'center',
    marginBottom: metrics.vs(24),
  },
  checkButton: {
    backgroundColor: '#2196F3',
    padding: metrics.s(20),
    borderRadius: metrics.ms(100),
    alignItems: 'center',
    width: metrics.s(150),
    height: metrics.s(150),
    justifyContent: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: metrics.ms(16),
    marginTop: metrics.vs(8),
  },
  historyContainer: {
    padding: metrics.s(16),
    backgroundColor: '#F5F5F5',
    borderRadius: metrics.ms(8),
  },
  historyTitle: {
    fontSize: metrics.ms(16),
    fontWeight: '500',
    marginBottom: metrics.vs(12),
  },
  historyItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: metrics.s(8),
  },
  historyText: {
    fontSize: metrics.ms(14),
    color: '#666',
  },
  disabledButton: {
    opacity: 0.7,
  },
  totalHours: {
    marginTop: metrics.vs(12),
    padding: metrics.s(8),
    backgroundColor: '#E3F2FD',
    borderRadius: metrics.ms(4),
  },
  totalHoursText: {
    color: '#2196F3',
    fontWeight: '500',
  },
  emptyText: {
    color: '#666',
    textAlign: 'center',
    marginTop: metrics.vs(8),
  },
  timeLogsContainer: {
    marginTop: metrics.vs(16),
    padding: metrics.s(12),
    backgroundColor: '#fff',
    borderRadius: metrics.ms(8),
  },
  timeLogsTitle: {
    fontSize: metrics.ms(14),
    fontWeight: '500',
    color: '#333',
    marginBottom: metrics.vs(8),
  },
  timeLogItem: {
    marginVertical: metrics.vs(8),
  },
  timeLogIndex: {
    fontSize: metrics.ms(14),
    fontWeight: '500',
    color: '#2196F3',
    marginBottom: metrics.vs(4),
  },
  timeLogDetails: {
    marginLeft: metrics.s(12),
    gap: metrics.vs(4),
  },
  timeLogRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: metrics.s(8),
  },
  timeLogText: {
    fontSize: metrics.ms(14),
    color: '#666',
  },
});

export default AttendanceScreen;
