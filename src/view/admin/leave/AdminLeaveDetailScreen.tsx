/* eslint-disable react/no-unstable-nested-components */
/* eslint-disable react-native/no-inline-styles */
/* eslint-disable react-hooks/exhaustive-deps */
import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  Alert,
  TouchableOpacity,
} from 'react-native';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {RootStackParamList} from '../../../navigation/type';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Icon from 'react-native-vector-icons/Ionicons';
import {
  LeaveRequestDetail,
  getLeaveRequestDetailAdmin,
  approveLeaveRequest,
  rejectLeaveRequest,
} from '../../../service/api/ApiService';
import metrics from '../../../constants/metrics';
import RejectDialog from '../../../components/RejectDialog';

type Props = NativeStackScreenProps<
  RootStackParamList,
  'AdminLeaveDetailScreen'
>;

const AdminLeaveDetailScreen = ({route, navigation}: Props) => {
  const {id} = route.params;
  const [loading, setLoading] = useState(true);
  const [request, setRequest] = useState<LeaveRequestDetail | null>(null);
  const [approving, setApproving] = useState(false);
  const [rejecting, setRejecting] = useState(false);
  const [showRejectDialog, setShowRejectDialog] = useState(false);
  const [rejectReason, setRejectReason] = useState('');

  useEffect(() => {
    fetchLeaveRequestDetail();
  }, []);

  const fetchLeaveRequestDetail = async () => {
    try {
      const token = await AsyncStorage.getItem('auth_token');
      if (!token) {
        navigation.replace('SignInScreen');
        return;
      }

      const data = await getLeaveRequestDetailAdmin(token, id);
      setRequest(data);
    } catch (err) {
      Alert.alert('Lỗi', 'Không thể tải chi tiết đơn xin nghỉ');
      navigation.goBack();
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async () => {
    try {
      setApproving(true);
      const token = await AsyncStorage.getItem('auth_token');
      if (!token) {
        navigation.replace('SignInScreen');
        return;
      }

      await approveLeaveRequest(token, id, 'Đơn xin nghỉ hợp lệ');
      Alert.alert('Thành công', 'Phê duyệt đơn xin nghỉ thành công', [
        {
          text: 'OK',
          onPress: () => {
            // Refresh the request details
            fetchLeaveRequestDetail();
          },
        },
      ]);
    } catch (err) {
      Alert.alert('Lỗi', 'Không thể phê duyệt đơn xin nghỉ');
    } finally {
      setApproving(false);
    }
  };

  const handleReject = async () => {
    if (!rejectReason.trim()) {
      Alert.alert('Lỗi', 'Vui lòng nhập lý do từ chối');
      return;
    }

    try {
      setRejecting(true);
      const token = await AsyncStorage.getItem('auth_token');
      if (!token) {
        navigation.replace('SignInScreen');
        return;
      }

      await rejectLeaveRequest(token, id, rejectReason);
      handleCloseRejectDialog();
      Alert.alert('Thành công', 'Từ chối đơn xin nghỉ thành công', [
        {
          text: 'OK',
          onPress: () => {
            fetchLeaveRequestDetail();
          },
        },
      ]);
    } catch (err) {
      Alert.alert('Lỗi', 'Không thể từ chối đơn xin nghỉ');
    } finally {
      setRejecting(false);
    }
  };

  const handleOpenRejectDialog = () => {
    setRejectReason('');
    setShowRejectDialog(true);
  };

  const handleCloseRejectDialog = () => {
    setShowRejectDialog(false);
    setRejectReason('');
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('vi-VN', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  if (loading) {
    return (
      <View style={[styles.container, styles.centerContent]}>
        <ActivityIndicator size="large" color="#2196F3" />
      </View>
    );
  }

  if (!request) {
    return null;
  }

  return (
    <>
      <ScrollView style={styles.container}>
        <View style={styles.card}>
          <View style={styles.header}>
            <Text style={styles.title}>Chi tiết đơn xin nghỉ</Text>
            <View
              style={[
                styles.statusBadge,
                {
                  backgroundColor:
                    request.status === 'approved'
                      ? '#4CAF50'
                      : request.status === 'rejected'
                      ? '#F44336'
                      : '#FFC107',
                },
              ]}>
              <Text style={styles.statusText}>
                {request.status === 'approved'
                  ? 'Đã duyệt'
                  : request.status === 'rejected'
                  ? 'Từ chối'
                  : 'Chờ duyệt'}
              </Text>
            </View>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Thông tin nhân viên</Text>
            <Text style={styles.infoText}>
              Email: {request.employeeId.email}
            </Text>
            <Text style={styles.infoText}>
              Ngày tạo tài khoản: {formatDate(request.employeeId.createdAt)}
            </Text>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Chi tiết nghỉ phép</Text>
            <View style={styles.infoRow}>
              <Icon name="calendar-outline" size={20} color="#666" />
              <Text style={styles.infoText}>
                Từ ngày: {formatDate(request.startDate)}
              </Text>
            </View>
            <View style={styles.infoRow}>
              <Icon name="calendar-outline" size={20} color="#666" />
              <Text style={styles.infoText}>
                Đến ngày: {formatDate(request.endDate)}
              </Text>
            </View>
            <View style={styles.infoRow}>
              <Icon name="time-outline" size={20} color="#666" />
              <Text style={styles.infoText}>
                Tổng số ngày: {request.totalDays}
              </Text>
            </View>
            <View style={styles.infoRow}>
              <Icon name="information-circle-outline" size={20} color="#666" />
              <Text style={styles.infoText}>
                Loại nghỉ: {request.type === 'sick' ? 'Nghỉ ốm' : 'Nghỉ phép'}
              </Text>
            </View>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Lý do</Text>
            <Text style={styles.reasonText}>{request.reason}</Text>
          </View>

          {request.status === 'pending' && request.canApprove && (
            <View style={styles.actionButtons}>
              <TouchableOpacity
                style={[styles.actionButton, styles.approveButton]}
                onPress={handleApprove}
                disabled={approving || rejecting}>
                {approving ? (
                  <ActivityIndicator size="small" color="#fff" />
                ) : (
                  <>
                    <Icon name="checkmark-circle" size={20} color="#fff" />
                    <Text style={styles.actionButtonText}>Phê duyệt</Text>
                  </>
                )}
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.actionButton, styles.rejectButton]}
                onPress={handleOpenRejectDialog}
                disabled={approving || rejecting}>
                {rejecting ? (
                  <ActivityIndicator size="small" color="#fff" />
                ) : (
                  <>
                    <Icon name="close-circle" size={20} color="#fff" />
                    <Text style={styles.actionButtonText}>Từ chối</Text>
                  </>
                )}
              </TouchableOpacity>
            </View>
          )}
        </View>
      </ScrollView>
      <RejectDialog
        visible={showRejectDialog}
        rejectReason={rejectReason}
        rejecting={rejecting}
        onReasonChange={setRejectReason}
        onCancel={handleCloseRejectDialog}
        onConfirm={handleReject}
      />
    </>
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
  card: {
    margin: metrics.s(16),
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
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: metrics.vs(16),
  },
  title: {
    fontSize: metrics.ms(20),
    fontWeight: '600',
    color: '#333',
  },
  statusBadge: {
    paddingHorizontal: metrics.s(12),
    paddingVertical: metrics.vs(6),
    borderRadius: metrics.ms(16),
  },
  statusText: {
    color: '#fff',
    fontSize: metrics.ms(14),
    fontWeight: '500',
  },
  section: {
    marginBottom: metrics.vs(20),
  },
  sectionTitle: {
    fontSize: metrics.ms(16),
    fontWeight: '600',
    color: '#333',
    marginBottom: metrics.vs(8),
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: metrics.s(8),
    marginBottom: metrics.vs(8),
  },
  infoText: {
    fontSize: metrics.ms(14),
    color: '#666',
  },
  reasonText: {
    fontSize: metrics.ms(14),
    color: '#666',
    lineHeight: metrics.vs(20),
  },
  actionButtons: {
    flexDirection: 'row',
    gap: metrics.s(12),
    marginTop: metrics.vs(20),
  },
  actionButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: metrics.s(8),
    padding: metrics.s(12),
    borderRadius: metrics.ms(8),
  },
  approveButton: {
    backgroundColor: '#4CAF50',
  },
  rejectButton: {
    backgroundColor: '#F44336',
  },
  actionButtonText: {
    color: '#fff',
    fontSize: metrics.ms(14),
    fontWeight: '500',
  },
});

export default AdminLeaveDetailScreen;
