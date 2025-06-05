import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList, ActivityIndicator } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import metrics from '../../constants/metrics';
import { getLeaveRequests, LeaveRequest } from '../../service/api/ApiService';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../navigation/type';

type Props = NativeStackScreenProps<RootStackParamList, 'LeaveScreen'>;

const getLeaveTypeText = (type: string) => {
  switch (type) {
    case 'sick':
      return 'Nghỉ ốm';
    case 'annual':
      return 'Nghỉ phép';
    default:
      return type;
  }
};

const LeaveScreen = ({ navigation }: Props) => {
  const [leaveRequests, setLeaveRequests] = useState<LeaveRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Fetch initial data
    fetchLeaveRequests();

    // Add listener for when screen comes into focus
    const unsubscribe = navigation.addListener('focus', () => {
      fetchLeaveRequests(); // Reload data when screen is focused
    });

    // Cleanup subscription on unmount
    return () => unsubscribe();
  }, [navigation]);

  const fetchLeaveRequests = async () => {
    try {
      setLoading(true);
      const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2ODNmZjBkYzQ5Y2Y1N2U3NWM2NWNiZjMiLCJlbWFpbCI6InRlc3QxQGV4YW1wbGUuY29tIiwiaWF0IjoxNzQ5MTYyMDY1LCJleHAiOjE3NDkyNDg0NjV9.DyD-BK5wSGzf9nH0qofaaS5_fOKf_Pb7VSCC2_udrkQ';
      const data = await getLeaveRequests(token);
      setLeaveRequests(data);
    } catch (err) {
      setError('Không thể tải danh sách đơn xin nghỉ');
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('vi-VN');
  };

  const renderItem = ({ item }: { item: LeaveRequest }) => (
    <View style={styles.leaveItem}>
      <View style={styles.leaveInfo}>
        <Text style={styles.leaveType}>{getLeaveTypeText(item.type)}</Text>
        <Text style={styles.leaveDate}>
          {`${formatDate(item.startDate)} - ${formatDate(item.endDate)}`}
        </Text>
        <Text style={styles.leaveReason}>{item.reason}</Text>
      </View>
      <View style={styles.statusContainer}>
        <Text style={[
          styles.leaveStatus,
          { color: item.status === 'approved' ? '#4CAF50' : '#FFC107' }
        ]}>
          {item.status === 'approved' ? 'Đã duyệt' : 'Chờ duyệt'}
        </Text>
        <Text style={styles.createdAt}>
          {new Date(item.createdAt).toLocaleDateString('vi-VN')}
        </Text>
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

  if (error) {
    return (
      <View style={[styles.container, styles.centerContent]}>
        <Text style={styles.errorText}>{error}</Text>
        <TouchableOpacity style={styles.retryButton} onPress={fetchLeaveRequests}>
          <Text style={styles.retryText}>Thử lại</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <TouchableOpacity 
        style={styles.addButton}
        onPress={() => navigation.navigate('CreateLeaveScreen')}>
        <Icon name="add-circle" size={metrics.ms(24)} color="#2196F3" />
        <Text style={styles.addButtonText}>Tạo đơn xin nghỉ</Text>
      </TouchableOpacity>
      
      <FlatList
        data={leaveRequests}
        renderItem={renderItem}
        keyExtractor={item => item._id}
        contentContainerStyle={styles.listContainer}
        refreshing={loading}
        onRefresh={fetchLeaveRequests}
        ListEmptyComponent={() => (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>Không có đơn xin nghỉ nào</Text>
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
  leaveItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: metrics.s(16),
    backgroundColor: '#F5F5F5',
    borderRadius: metrics.ms(8),
  },
  leaveInfo: {
    gap: metrics.vs(4),
  },
  leaveType: {
    fontSize: metrics.ms(16),
    fontWeight: '600',
    color: '#2196F3',
  },
  leaveDate: {
    fontSize: metrics.ms(14),
    color: '#666',
    marginTop: metrics.vs(4),
  },
  leaveStatus: {
    fontSize: metrics.ms(14),
    fontWeight: '500',
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
  leaveReason: {
    fontSize: metrics.ms(14),
    color: '#666',
    marginTop: metrics.vs(4),
  },
  statusContainer: {
    alignItems: 'flex-end',
  },
  createdAt: {
    fontSize: metrics.ms(12),
    color: '#999',
    marginTop: metrics.vs(4),
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

export default LeaveScreen;