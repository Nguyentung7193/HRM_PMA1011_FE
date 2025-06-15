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
  AdminOTReportDetail,
  getOTReportDetailAdmin,
  approveOTReport,
  rejectOTReport,
} from '../../../service/api/ApiService';
import metrics from '../../../constants/metrics';
import RejectDialog from '../../../components/RejectDialog';

type Props = NativeStackScreenProps<
  RootStackParamList,
  'AdminOTReportDetailScreen'
>;

const AdminOTReportDetailScreen = ({route, navigation}: Props) => {
  const {id} = route.params;
  const [loading, setLoading] = useState(true);
  const [report, setReport] = useState<AdminOTReportDetail | null>(null);
  const [approving, setApproving] = useState(false);
  const [showRejectDialog, setShowRejectDialog] = useState(false);
  const [rejecting, setRejecting] = useState(false);
  const [rejectReason, setRejectReason] = useState('');

  useEffect(() => {
    fetchOTReportDetail();
  }, []);

  const fetchOTReportDetail = async () => {
    try {
      const token = await AsyncStorage.getItem('auth_token');
      if (!token) {
        navigation.replace('SignInScreen');
        return;
      }

      const data = await getOTReportDetailAdmin(token, id);
      setReport(data);
    } catch (err) {
      Alert.alert('Lỗi', 'Không thể tải chi tiết báo cáo OT');
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

      await approveOTReport(token, id, 'Approved - Valid overtime work');
      Alert.alert('Thành công', 'Phê duyệt báo cáo OT thành công', [
        {
          text: 'OK',
          onPress: () => {
            // Refresh the report details
            fetchOTReportDetail();
          },
        },
      ]);
    } catch (err) {
      Alert.alert('Lỗi', 'Không thể phê duyệt báo cáo OT');
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

      await rejectOTReport(token, id, rejectReason);
      setShowRejectDialog(false);
      setRejectReason('');
      Alert.alert('Thành công', 'Từ chối báo cáo OT thành công', [
        {
          text: 'OK',
          onPress: () => {
            fetchOTReportDetail();
          },
        },
      ]);
    } catch (err) {
      Alert.alert('Lỗi', 'Không thể từ chối báo cáo OT');
    } finally {
      setRejecting(false);
    }
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

  if (!report) {
    return null;
  }

  return (
    <>
      <ScrollView style={styles.container}>
        <View style={styles.card}>
          <View style={styles.header}>
            <Text style={styles.title}>Chi tiết báo cáo OT</Text>
            <View
              style={[
                styles.statusBadge,
                {
                  backgroundColor:
                    report.status === 'approved'
                      ? '#4CAF50'
                      : report.status === 'rejected'
                      ? '#F44336'
                      : '#FFC107',
                },
              ]}>
              <Text style={styles.statusText}>
                {report.status === 'approved'
                  ? 'Đã duyệt'
                  : report.status === 'rejected'
                  ? 'Từ chối'
                  : 'Chờ duyệt'}
              </Text>
            </View>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Thông tin nhân viên</Text>
            <Text style={styles.infoText}>
              Email: {report.employeeId.email}
            </Text>
            <Text style={styles.infoText}>
              Ngày tạo tài khoản: {formatDate(report.employeeId.createdAt)}
            </Text>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Chi tiết OT</Text>
            <View style={styles.infoRow}>
              <Icon name="calendar-outline" size={20} color="#666" />
              <Text style={styles.infoText}>
                Ngày: {formatDate(report.date)}
              </Text>
            </View>
            <View style={styles.infoRow}>
              <Icon name="time-outline" size={20} color="#666" />
              <Text style={styles.infoText}>
                Thời gian: {report.startTime} - {report.endTime}
              </Text>
            </View>
            <View style={styles.infoRow}>
              <Icon name="hourglass-outline" size={20} color="#666" />
              <Text style={styles.infoText}>
                Tổng số giờ: {report.totalHours} giờ
              </Text>
            </View>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Lý do</Text>
            <Text style={styles.reasonText}>{report.reason}</Text>
          </View>

          {report.status === 'pending' && report.canApprove && (
            <View style={styles.actionButtons}>
              <TouchableOpacity
                style={[styles.actionButton, styles.approveButton]}
                onPress={handleApprove}
                disabled={approving}>
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
                onPress={() => setShowRejectDialog(true)}
                disabled={approving}>
                <Icon name="close-circle" size={20} color="#fff" />
                <Text style={styles.actionButtonText}>Từ chối</Text>
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
        onCancel={() => {
          setShowRejectDialog(false);
          setRejectReason('');
        }}
        onConfirm={handleReject}
      />
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
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

export default AdminOTReportDetailScreen;
