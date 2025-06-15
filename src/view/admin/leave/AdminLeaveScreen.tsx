/* eslint-disable react-hooks/exhaustive-deps */
import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useNavigation} from '@react-navigation/native';
import Icon from 'react-native-vector-icons/Ionicons';
import {
  AdminLeaveRequest,
  getAdminLeaveRequests,
} from '../../../service/api/ApiService';
import metrics from '../../../constants/metrics';
import {TabScreenNavigationProp} from '../../../navigation/type';

const AdminLeaveScreen = () => {
  const navigation = useNavigation<TabScreenNavigationProp>();
  const [loading, setLoading] = useState(true);
  const [requests, setRequests] = useState<AdminLeaveRequest[]>([]);

  useEffect(() => {
    fetchLeaveRequests();

    const unsubscribe = navigation.addListener('focus', () => {
      fetchLeaveRequests();
    });

    return () => unsubscribe();
  }, [navigation]);

  const fetchLeaveRequests = async () => {
    try {
      setLoading(true);
      const token = await AsyncStorage.getItem('auth_token');
      if (!token) {
        navigation.replace('SignInScreen');
        return;
      }

      const data = await getAdminLeaveRequests(token);
      setRequests(data.requests);
    } catch (err) {
      Alert.alert('Lỗi', 'Không thể tải danh sách đơn xin nghỉ');
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('vi-VN');
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved':
        return '#4CAF50';
      case 'rejected':
        return '#F44336';
      default:
        return '#FFC107';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'approved':
        return 'Đã duyệt';
      case 'rejected':
        return 'Từ chối';
      default:
        return 'Chờ duyệt';
    }
  };

  const renderLeaveItem = ({item}: {item: AdminLeaveRequest}) => (
    <TouchableOpacity
      style={styles.card}
      onPress={() =>
        navigation.navigate('AdminLeaveDetailScreen', {id: item._id})
      }>
      <View style={styles.cardHeader}>
        <View style={styles.employeeInfo}>
          <Text style={styles.employeeName}>{item.employeeId.name}</Text>
          <Text style={styles.position}>{item.employeeId.position}</Text>
        </View>
        <View
          style={[
            styles.statusBadge,
            {backgroundColor: getStatusColor(item.status)},
          ]}>
          <Text style={styles.statusText}>{getStatusText(item.status)}</Text>
        </View>
      </View>

      <View style={styles.cardContent}>
        <View style={styles.infoRow}>
          <Icon name="calendar-outline" size={16} color="#666" />
          <Text style={styles.infoText}>
            {formatDate(item.startDate)} - {formatDate(item.endDate)}
          </Text>
        </View>

        <View style={styles.infoRow}>
          <Icon name="information-circle-outline" size={16} color="#666" />
          <Text style={styles.infoText}>
            {item.type === 'sick' ? 'Nghỉ ốm' : 'Nghỉ phép'}
          </Text>
        </View>

        <View style={styles.reasonContainer}>
          <Text style={styles.reasonTitle}>Lý do:</Text>
          <Text style={styles.reasonText} numberOfLines={2}>
            {item.reason}
          </Text>
        </View>
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

  return (
    <View style={styles.container}>
      <FlatList
        data={requests}
        renderItem={renderLeaveItem}
        keyExtractor={item => item._id}
        contentContainerStyle={styles.listContainer}
        ListEmptyComponent={
          <Text style={styles.emptyText}>Không có đơn xin nghỉ nào</Text>
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
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: metrics.vs(12),
  },
  employeeInfo: {
    flex: 1,
  },
  employeeName: {
    fontSize: metrics.ms(16),
    fontWeight: '600',
    color: '#333',
  },
  position: {
    fontSize: metrics.ms(12),
    color: '#666',
    marginTop: metrics.vs(2),
  },
  statusBadge: {
    paddingHorizontal: metrics.s(8),
    paddingVertical: metrics.vs(4),
    borderRadius: metrics.ms(12),
  },
  statusText: {
    color: '#fff',
    fontSize: metrics.ms(12),
    fontWeight: '500',
  },
  cardContent: {
    gap: metrics.vs(8),
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: metrics.s(8),
  },
  infoText: {
    fontSize: metrics.ms(14),
    color: '#666',
  },
  reasonContainer: {
    marginTop: metrics.vs(4),
  },
  reasonTitle: {
    fontSize: metrics.ms(14),
    fontWeight: '500',
    color: '#333',
    marginBottom: metrics.vs(4),
  },
  reasonText: {
    fontSize: metrics.ms(14),
    color: '#666',
  },
  emptyText: {
    textAlign: 'center',
    fontSize: metrics.ms(16),
    color: '#666',
    marginTop: metrics.vs(20),
  },
});

export default AdminLeaveScreen;
