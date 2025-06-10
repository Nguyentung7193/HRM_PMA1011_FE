/* eslint-disable react-hooks/exhaustive-deps */
import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  Alert,
} from 'react-native';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import Icon from 'react-native-vector-icons/Ionicons';
import metrics from '../../constants/metrics';
import {RootStackParamList} from '../../navigation/type';
import {OTReport, getOTDetail, updateOTReport} from '../../service/api/ApiService';
import AsyncStorage from '@react-native-async-storage/async-storage';
import EditOTModal from '../../components/EditOTModal';

type Props = NativeStackScreenProps<RootStackParamList, 'OTDetailScreen'>;

const OTDetailScreen = ({route, navigation}: Props) => {
  const {otId} = route.params;
  const [report, setReport] = useState<OTReport | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);

  useEffect(() => {
    fetchOTDetail();
  }, [otId]);

  const fetchOTDetail = async () => {
    try {
      setLoading(true);
      const token = await AsyncStorage.getItem('auth_token');

      if (!token) {
        setError('Phiên đăng nhập đã hết hạn');
        navigation.replace('SignInScreen');
        return;
      }

      const data = await getOTDetail(token, otId);
      setReport(data);
    } catch (err: any) {
      const errorMessage =
        err.response?.data?.message || 'Không thể tải thông tin báo cáo OT';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('vi-VN');
  };

  const handleBack = () => {
    navigation.goBack();
  };

  const handleDelete = () => {
    Alert.alert(
      'Xác nhận xoá',
      'Bạn có chắc chắn muốn xoá báo cáo OT này?',
      [
        {
          text: 'Huỷ',
          style: 'cancel',
        },
        {
          text: 'Xoá',
          style: 'destructive',
          onPress: async () => {
            try {
              setLoading(true);
              const token = await AsyncStorage.getItem('auth_token');
              if (!token) {
                setError('Phiên đăng nhập đã hết hạn');
                return;
              }
              // TODO: Implement delete API call
              navigation.goBack();
            } catch (err: any) {
              const errorMessage =
                err.response?.data?.message || 'Không thể xoá báo cáo OT';
              Alert.alert('Lỗi', errorMessage);
            } finally {
              setLoading(false);
            }
          },
        },
      ],
    );
  };

  if (loading) {
    return (
      <View style={[styles.container, styles.centerContent]}>
        <ActivityIndicator size="large" color="#2196F3" />
      </View>
    );
  }

  if (error || !report) {
    return (
      <View style={[styles.container, styles.centerContent]}>
        <Text style={styles.errorText}>
          {error || 'Không tìm thấy báo cáo OT'}
        </Text>
        <TouchableOpacity style={styles.retryButton} onPress={fetchOTDetail}>
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
        <Text style={styles.headerTitle}>Chi tiết báo cáo OT</Text>
        <View style={{width: metrics.s(24)}} />
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.card}>
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Dự án</Text>
            <Text style={styles.sectionContent}>{report.project}</Text>
          </View>

          <View style={styles.divider} />

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Ngày làm việc</Text>
            <Text style={styles.sectionContent}>{formatDate(report.date)}</Text>
          </View>

          <View style={styles.divider} />

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Thời gian</Text>
            <Text style={styles.sectionContent}>
              {`${report.startTime} - ${report.endTime} (${report.totalHours}h)`}
            </Text>
          </View>

          <View style={styles.divider} />

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Công việc</Text>
            <Text style={styles.sectionContent}>{report.tasks}</Text>
          </View>

          <View style={styles.divider} />

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Lý do</Text>
            <Text style={styles.sectionContent}>{report.reason}</Text>
          </View>

          <View style={styles.divider} />

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Trạng thái</Text>
            <View style={styles.statusBadge}>
              <Text
                style={[
                  styles.statusText,
                  {color: report.status === 'approved' ? '#4CAF50' : '#FFC107'},
                ]}>
                {report.status === 'approved' ? 'Đã duyệt' : 'Chờ duyệt'}
              </Text>
            </View>
          </View>

          <View style={styles.divider} />

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Ngày tạo</Text>
            <Text style={styles.sectionContent}>
              {new Date(report.createdAt).toLocaleDateString('vi-VN', {
                hour: '2-digit',
                minute: '2-digit',
              })}
            </Text>
          </View>
        </View>
      </ScrollView>

      <EditOTModal
        visible={isEditModalVisible}
        onClose={() => setIsEditModalVisible(false)}
        onSubmit={async (data) => {
          try {
            const token = await AsyncStorage.getItem('auth_token');
            if (!token) {
              setError('Phiên đăng nhập đã hết hạn');
              return;
            }
            await updateOTReport(token, otId, data);
            setIsEditModalVisible(false);
            await fetchOTDetail();
            Alert.alert('Thành công', 'Cập nhật báo cáo OT thành công');
          } catch (err: any) {
            const errorMessage =
              err.response?.data?.message || 'Không thể cập nhật báo cáo OT';
            Alert.alert('Lỗi', errorMessage);
          }
        }}
        initialData={{
          date: report.date.split('T')[0],
          startTime: report.startTime,
          endTime: report.endTime,
          totalHours: report.totalHours,
          reason: report.reason,
          project: report.project,
          tasks: report.tasks,
        }}
      />

      {report.status === 'pending' && (
        <View style={styles.footer}>
          <TouchableOpacity
            style={[styles.button, styles.cancelButton]}
            onPress={handleDelete}>
            <Text style={styles.cancelButtonText}>Huỷ</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.button, styles.updateButton]}
            onPress={() => {
              console.log('Opening modal...'); // Thêm log để debug
              setIsEditModalVisible(true);
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
});

export default OTDetailScreen;