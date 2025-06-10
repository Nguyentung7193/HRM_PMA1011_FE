import React, {useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  TextInput,
  Alert,
  ActivityIndicator,
} from 'react-native';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import Icon from 'react-native-vector-icons/Ionicons';
import metrics from '../../constants/metrics';
import {RootStackParamList} from '../../navigation/type';
import {createOTReport, CreateOTRequest} from '../../service/api/ApiService';
import AsyncStorage from '@react-native-async-storage/async-storage';

type Props = NativeStackScreenProps<RootStackParamList, 'CreateOTScreen'>;

const CreateOTScreen = ({navigation}: Props) => {
  const [date, setDate] = useState('');
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');
  const [totalHours, setTotalHours] = useState('');
  const [reason, setReason] = useState('');
  const [project, setProject] = useState('');
  const [tasks, setTasks] = useState('');
  const [loading, setLoading] = useState(false);

  const handleBack = () => {
    navigation.goBack();
  };

  const handleSubmit = async () => {
    if (!date || !startTime || !endTime || !totalHours || !reason || !project || !tasks) {
      Alert.alert('Lỗi', 'Vui lòng điền đầy đủ thông tin');
      return;
    }

    try {
      setLoading(true);
      const token = await AsyncStorage.getItem('auth_token');

      if (!token) {
        Alert.alert('Lỗi', 'Phiên đăng nhập đã hết hạn');
        return;
      }

      const data: CreateOTRequest = {
        date,
        startTime,
        endTime,
        totalHours: Number(totalHours),
        reason,
        project,
        tasks,
      };

      await createOTReport(token, data);
      Alert.alert('Thành công', 'Tạo báo cáo OT thành công', [
        {
          text: 'OK',
          onPress: () => navigation.goBack(),
        },
      ]);
    } catch (err: any) {
      const errorMessage =
        err.response?.data?.message || 'Không thể tạo báo cáo OT';
      Alert.alert('Lỗi', errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={handleBack} style={styles.backButton}>
          <Icon name="arrow-back" size={metrics.ms(24)} color="#2196F3" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Tạo báo cáo OT</Text>
        <View style={{width: metrics.s(24)}} />
      </View>

      <ScrollView
        style={styles.content}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled">
        <View style={styles.formContainer}>
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Ngày làm việc (YYYY-MM-DD)</Text>
            <TextInput
              style={styles.input}
              value={date}
              onChangeText={setDate}
              placeholder="YYYY-MM-DD"
            />
          </View>

          <View style={styles.timeContainer}>
            <View style={styles.timeInput}>
              <Text style={styles.label}>Giờ bắt đầu (HH:mm)</Text>
              <TextInput
                style={styles.input}
                value={startTime}
                onChangeText={setStartTime}
                placeholder="HH:mm"
              />
            </View>

            <View style={styles.timeInput}>
              <Text style={styles.label}>Giờ kết thúc (HH:mm)</Text>
              <TextInput
                style={styles.input}
                value={endTime}
                onChangeText={setEndTime}
                placeholder="HH:mm"
              />
            </View>
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>Số giờ</Text>
            <TextInput
              style={styles.input}
              value={totalHours}
              onChangeText={setTotalHours}
              keyboardType="numeric"
              placeholder="Nhập số giờ"
            />
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>Dự án</Text>
            <TextInput
              style={styles.input}
              value={project}
              onChangeText={setProject}
              placeholder="Tên dự án"
            />
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>Công việc</Text>
            <TextInput
              style={[styles.input, styles.textArea]}
              value={tasks}
              onChangeText={setTasks}
              placeholder="Mô tả công việc"
              multiline
            />
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>Lý do</Text>
            <TextInput
              style={[styles.input, styles.textArea]}
              value={reason}
              onChangeText={setReason}
              placeholder="Lý do làm thêm giờ"
              multiline
            />
          </View>
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <TouchableOpacity
          style={[styles.submitButton, loading && styles.disabledButton]}
          onPress={handleSubmit}
          disabled={loading}>
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.submitButtonText}>Tạo báo cáo</Text>
          )}
        </TouchableOpacity>
      </View>
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
  },
  formContainer: {
    padding: metrics.s(16),
  },
  inputContainer: {
    marginBottom: metrics.vs(16),
  },
  timeContainer: {
    flexDirection: 'row',
    gap: metrics.s(12),
    marginBottom: metrics.vs(16),
  },
  timeInput: {
    flex: 1,
  },
  label: {
    fontSize: metrics.ms(14),
    color: '#666',
    marginBottom: metrics.vs(4),
  },
  input: {
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderRadius: metrics.s(8),
    padding: metrics.s(12),
    fontSize: metrics.ms(16),
  },
  textArea: {
    height: metrics.vs(100),
    textAlignVertical: 'top',
  },
  footer: {
    padding: metrics.s(16),
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
  },
  submitButton: {
    backgroundColor: '#2196F3',
    padding: metrics.s(16),
    borderRadius: metrics.s(8),
    alignItems: 'center',
  },
  disabledButton: {
    opacity: 0.7,
  },
  submitButtonText: {
    color: '#fff',
    fontSize: metrics.ms(16),
    fontWeight: '600',
  },
});

export default CreateOTScreen;