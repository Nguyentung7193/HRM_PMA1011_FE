import React, {useState} from 'react';
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
import CustomInput from '../../components/CustomInput';
import {createLeaveRequest} from '../../service/api/ApiService';

type Props = NativeStackScreenProps<RootStackParamList, 'CreateLeaveScreen'>;

const CreateLeaveScreen = ({navigation}: Props) => {
  const [type, setType] = useState<'sick' | 'annual'>('sick');
  const [reason, setReason] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async () => {
    try {
      setLoading(true);
      setError(null);

      if (!reason || !startDate || !endDate) {
        setError('Vui lòng điền đầy đủ thông tin');
        return;
      }

      const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2ODNmZjBkYzQ5Y2Y1N2U3NWM2NWNiZjMiLCJlbWFpbCI6InRlc3QxQGV4YW1wbGUuY29tIiwiaWF0IjoxNzQ5MTYyMDY1LCJleHAiOjE3NDkyNDg0NjV9.DyD-BK5wSGzf9nH0qofaaS5_fOKf_Pb7VSCC2_udrkQ'; // Replace with your token management

      await createLeaveRequest(token, {
        type,
        reason,
        startDate,
        endDate,
      });

      navigation.goBack();
    } catch (err) {
      setError('Có lỗi xảy ra khi tạo đơn');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Icon name="arrow-back" size={metrics.ms(24)} color="#2196F3" />
        </TouchableOpacity>
        <Text style={styles.title}>Tạo đơn xin nghỉ</Text>
        <View style={{width: metrics.s(24)}} />
      </View>

      <View style={styles.content}>
        <View style={styles.typeContainer}>
          <TouchableOpacity
            style={[
              styles.typeButton,
              type === 'sick' && styles.typeButtonActive,
            ]}
            onPress={() => setType('sick')}>
            <Text
              style={[
                styles.typeText,
                type === 'sick' && styles.typeTextActive,
              ]}>
              Nghỉ ốm
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.typeButton,
              type === 'annual' && styles.typeButtonActive,
            ]}
            onPress={() => setType('annual')}>
            <Text
              style={[
                styles.typeText,
                type === 'annual' && styles.typeTextActive,
              ]}>
              Nghỉ phép
            </Text>
          </TouchableOpacity>
        </View>

        <CustomInput
          placeholder="Lý do xin nghỉ"
          value={reason}
          onChangeText={setReason}
        />

        <CustomInput
          placeholder="Ngày bắt đầu (YYYY-MM-DD)"
          value={startDate}
          onChangeText={setStartDate}
        />

        <CustomInput
          placeholder="Ngày kết thúc (YYYY-MM-DD)"
          value={endDate}
          onChangeText={setEndDate}
        />

        {error && <Text style={styles.errorText}>{error}</Text>}

        <TouchableOpacity
          style={[styles.submitButton, loading && styles.submitButtonDisabled]}
          onPress={handleSubmit}
          disabled={loading}>
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.submitButtonText}>Gửi đơn</Text>
          )}
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
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
  title: {
    fontSize: metrics.ms(18),
    fontWeight: '600',
    color: '#2196F3',
  },
  content: {
    padding: metrics.s(16),
    gap: metrics.vs(16),
  },
  typeContainer: {
    flexDirection: 'row',
    gap: metrics.s(12),
  },
  typeButton: {
    flex: 1,
    padding: metrics.s(12),
    borderRadius: metrics.ms(8),
    borderWidth: 1,
    borderColor: '#2196F3',
    alignItems: 'center',
  },
  typeButtonActive: {
    backgroundColor: '#2196F3',
  },
  typeText: {
    color: '#2196F3',
    fontSize: metrics.ms(14),
    fontWeight: '500',
  },
  typeTextActive: {
    color: '#fff',
  },
  errorText: {
    color: '#f44336',
    fontSize: metrics.ms(14),
  },
  submitButton: {
    backgroundColor: '#2196F3',
    padding: metrics.s(16),
    borderRadius: metrics.ms(8),
    alignItems: 'center',
    marginTop: metrics.vs(16),
  },
  submitButtonDisabled: {
    opacity: 0.7,
  },
  submitButtonText: {
    color: '#fff',
    fontSize: metrics.ms(16),
    fontWeight: '600',
  },
});

export default CreateLeaveScreen;
