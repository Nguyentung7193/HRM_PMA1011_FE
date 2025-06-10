/* eslint-disable react/no-unstable-nested-components */
/* eslint-disable react-native/no-inline-styles */
/* eslint-disable react-hooks/exhaustive-deps */
import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  ActivityIndicator,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import Icon from 'react-native-vector-icons/Ionicons';
import metrics from '../../constants/metrics';
import {TabScreenNavigationProp} from '../../navigation/type';
import {getOTReports, OTReport} from '../../service/api/ApiService';
import AsyncStorage from '@react-native-async-storage/async-storage';

const OvertimeScreen = () => {
  const navigation = useNavigation<TabScreenNavigationProp>();
  const [otReports, setOTReports] = useState<OTReport[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchOTReports();

    const unsubscribe = navigation.addListener('focus', () => {
      fetchOTReports();
    });

    return () => unsubscribe();
  }, [navigation]);

  const fetchOTReports = async () => {
    try {
      setLoading(true);
      const token = await AsyncStorage.getItem('auth_token');

      if (!token) {
        setError('Phiên đăng nhập đã hết hạn');
        navigation.replace('SignInScreen');
        return;
      }

      const data = await getOTReports(token);
      setOTReports(data);
    } catch (err) {
      setError('Không thể tải danh sách OT');
    } finally {
      setLoading(false);
    }
  };

  const formatTime = (time: string) => {
    return time;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('vi-VN');
  };

  const renderItem = ({item}: {item: OTReport}) => (
    <TouchableOpacity
      style={styles.otItem}
      onPress={() => navigation.navigate('OTDetailScreen', {otId: item._id})}>
      <View style={styles.otInfo}>
        <Text style={styles.project}>{item.project}</Text>
        <Text style={styles.date}>{formatDate(item.date)}</Text>
        <Text style={styles.time}>
          {`${formatTime(item.startTime)} - ${formatTime(item.endTime)} (${
            item.totalHours
          }h)`}
        </Text>
        <Text style={styles.tasks}>{item.tasks}</Text>
      </View>
      <View style={styles.statusContainer}>
        <Text
          style={[
            styles.status,
            {color: item.status === 'approved' ? '#4CAF50' : '#FFC107'},
          ]}>
          {item.status === 'approved' ? 'Đã duyệt' : 'Chờ duyệt'}
        </Text>
        <Text style={styles.createdAt}>
          {new Date(item.createdAt).toLocaleDateString('vi-VN')}
        </Text>
      </View>
    </TouchableOpacity>
  );

  if (loading) {
    return (
      <View style={[styles.container, styles.centerContent]}>
        <ActivityIndicator size="large" color="#2196F3" />
      </View>
    );
  }

  if (error) {
    return (
      <View style={[styles.container, styles.centerContent]}>
        <Text style={styles.errorText}>{error}</Text>
        <TouchableOpacity style={styles.retryButton} onPress={fetchOTReports}>
          <Text style={styles.retryText}>Thử lại</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.addButton}
        onPress={() => navigation.navigate('CreateOTScreen')}>
        <Icon name="add-circle" size={metrics.ms(24)} color="#2196F3" />
        <Text style={styles.addButtonText}>Tạo báo cáo OT</Text>
      </TouchableOpacity>

      <FlatList
        data={otReports}
        renderItem={renderItem}
        keyExtractor={item => item._id}
        contentContainerStyle={styles.listContainer}
        refreshing={loading}
        onRefresh={fetchOTReports}
        ListEmptyComponent={() => (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>Không có báo cáo OT nào</Text>
          </View>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: metrics.s(16),
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: metrics.s(12),
    backgroundColor: '#E3F2FD',
    borderRadius: metrics.ms(8),
    marginBottom: metrics.vs(16),
  },
  addButtonText: {
    marginLeft: metrics.s(8),
    color: '#2196F3',
    fontSize: metrics.ms(16),
    fontWeight: '500',
  },
  listContainer: {
    gap: metrics.vs(12),
  },
  otItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: metrics.s(16),
    backgroundColor: '#F5F5F5',
    borderRadius: metrics.ms(8),
  },
  otInfo: {
    flex: 1,
    gap: metrics.vs(4),
  },
  project: {
    fontSize: metrics.ms(16),
    fontWeight: '600',
    color: '#2196F3',
  },
  date: {
    fontSize: metrics.ms(14),
    color: '#666',
  },
  time: {
    fontSize: metrics.ms(14),
    color: '#666',
    fontWeight: '500',
  },
  tasks: {
    fontSize: metrics.ms(14),
    color: '#666',
    marginTop: metrics.vs(4),
  },
  statusContainer: {
    alignItems: 'flex-end',
  },
  status: {
    fontSize: metrics.ms(14),
    fontWeight: '500',
  },
  createdAt: {
    fontSize: metrics.ms(12),
    color: '#999',
    marginTop: metrics.vs(4),
  },
  centerContent: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorText: {
    color: '#f44336',
    fontSize: metrics.ms(16),
    marginBottom: metrics.vs(16),
  },
  retryButton: {
    padding: metrics.s(12),
    backgroundColor: '#2196F3',
    borderRadius: metrics.ms(8),
  },
  retryText: {
    color: '#fff',
    fontSize: metrics.ms(14),
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: metrics.vs(20),
  },
  emptyText: {
    fontSize: metrics.ms(16),
    color: '#666',
  },
});

export default OvertimeScreen;
