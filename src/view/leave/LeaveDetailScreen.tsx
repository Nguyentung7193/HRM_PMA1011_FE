/* eslint-disable react-hooks/exhaustive-deps */
import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import Icon from 'react-native-vector-icons/Ionicons';
import metrics from '../../constants/metrics';
import {RootStackParamList} from '../../navigation/type';
import {LeaveRequest, getLeaveDetail} from '../../service/api/ApiService';
import AsyncStorage from '@react-native-async-storage/async-storage';

type Props = NativeStackScreenProps<RootStackParamList, 'LeaveDetailScreen'>;

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

const LeaveDetailScreen = ({route, navigation}: Props) => {
  const {leaveId} = route.params;
  const [leave, setLeave] = useState<LeaveRequest | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchLeaveDetail();
  }, [leaveId]);

  const fetchLeaveDetail = async () => {
    try {
      setLoading(true);
      const token = await AsyncStorage.getItem('auth_token');

      if (!token) {
        setError('Phiên đăng nhập đã hết hạn');
        navigation.replace('SignInScreen');
        return;
      }

      const data = await getLeaveDetail(token, leaveId);
      setLeave(data);
    } catch (err: any) {
      const errorMessage =
        err.response?.data?.message || 'Không thể tải thông tin đơn xin nghỉ';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('vi-VN');
  };

  const getStatusColor = (status: string) => {
    return status === 'approved' ? '#4CAF50' : '#FFC107';
  };

  const handleBack = () => {
    navigation.goBack();
  };

  if (loading) {
    return (
      <View style={[styles.container, styles.centerContent]}>
        <ActivityIndicator size="large" color="#2196F3" />
      </View>
    );
  }

  if (error || !leave) {
    return (
      <View style={[styles.container, styles.centerContent]}>
        <Text style={styles.errorText}>
          {error || 'Không tìm thấy đơn xin nghỉ'}
        </Text>
        <TouchableOpacity style={styles.retryButton} onPress={fetchLeaveDetail}>
          <Text style={styles.retryText}>Thử lại</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={handleBack} style={styles.backButton}>
          <Icon name="arrow-back" size={metrics.ms(24)} color="#2196F3" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Chi tiết đơn xin nghỉ</Text>
        <View style={{width: metrics.s(24)}} />
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.card}>
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Loại nghỉ phép</Text>
            <Text style={styles.sectionContent}>
              {getLeaveTypeText(leave.type)}
            </Text>
          </View>

          <View style={styles.divider} />

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Thời gian</Text>
            <Text style={styles.sectionContent}>
              {`${formatDate(leave.startDate)} - ${formatDate(leave.endDate)}`}
            </Text>
          </View>

          <View style={styles.divider} />

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Lý do</Text>
            <Text style={styles.sectionContent}>{leave.reason}</Text>
          </View>

          <View style={styles.divider} />

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Trạng thái</Text>
            <View style={styles.statusBadge}>
              <Text
                style={[
                  styles.statusText,
                  {color: getStatusColor(leave.status)},
                ]}>
                {leave.status === 'approved' ? 'Đã duyệt' : 'Chờ duyệt'}
              </Text>
            </View>
          </View>

          <View style={styles.divider} />

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Ngày tạo</Text>
            <Text style={styles.sectionContent}>
              {new Date(leave.createdAt).toLocaleDateString('vi-VN', {
                hour: '2-digit',
                minute: '2-digit',
              })}
            </Text>
          </View>
        </View>
      </ScrollView>

      {leave.status === 'pending' && (
        <View style={styles.footer}>
          <TouchableOpacity
            style={[styles.button, styles.cancelButton]}
            onPress={() => {
              /* TODO: Handle cancel */
            }}>
            <Text style={styles.cancelButtonText}>Huỷ đơn</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.button, styles.updateButton]}
            onPress={() => {
              /* TODO: Handle update */
            }}>
            <Text style={styles.updateButtonText}>Cập nhật</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: metrics.vs(30),
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: metrics.s(16),
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  backButton: {
    padding: metrics.s(8),
    marginLeft: -metrics.s(8),
  },
  headerTitle: {
    fontSize: metrics.ms(18),
    fontWeight: '600',
    color: '#2196F3',
  },
  content: {
    flex: 1,
    padding: metrics.s(16),
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: metrics.s(12),
    padding: metrics.s(16),
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  section: {
    marginVertical: metrics.vs(8),
  },
  sectionTitle: {
    fontSize: metrics.ms(14),
    color: '#666',
    marginBottom: metrics.vs(4),
    fontWeight: '500',
  },
  sectionContent: {
    fontSize: metrics.ms(16),
    color: '#000',
    lineHeight: metrics.vs(24),
  },
  divider: {
    height: 1,
    backgroundColor: '#e0e0e0',
    marginVertical: metrics.vs(8),
  },
  statusBadge: {
    backgroundColor: '#f5f5f5',
    paddingHorizontal: metrics.s(12),
    paddingVertical: metrics.vs(6),
    borderRadius: metrics.s(16),
    alignSelf: 'flex-start',
  },
  statusText: {
    fontSize: metrics.ms(14),
    fontWeight: '600',
  },
  footer: {
    flexDirection: 'row',
    padding: metrics.s(16),
    paddingBottom: metrics.vs(32),
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
    gap: metrics.s(12),
  },
  button: {
    flex: 1,
    paddingVertical: metrics.vs(12),
    borderRadius: metrics.s(8),
    alignItems: 'center',
    justifyContent: 'center',
  },
  cancelButton: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#ff4444',
  },
  updateButton: {
    backgroundColor: '#2196F3',
  },
  cancelButtonText: {
    color: '#ff4444',
    fontSize: metrics.ms(16),
    fontWeight: '600',
  },
  updateButtonText: {
    color: '#fff',
    fontSize: metrics.ms(16),
    fontWeight: '600',
  },
  centerContent: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorText: {
    fontSize: metrics.ms(16),
    color: 'red',
    marginBottom: metrics.vs(16),
  },
  retryButton: {
    backgroundColor: '#2196F3',
    paddingVertical: metrics.vs(12),
    paddingHorizontal: metrics.s(24),
    borderRadius: metrics.s(8),
  },
  retryText: {
    color: '#fff',
    fontSize: metrics.ms(16),
    fontWeight: '500',
  },
});

export default LeaveDetailScreen;
