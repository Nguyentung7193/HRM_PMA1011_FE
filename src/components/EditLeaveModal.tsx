import React, {useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import CustomInput from './CustomInput';
import metrics from '../constants/metrics';
import Icon from 'react-native-vector-icons/Ionicons';

type LeaveType = 'sick' | 'annual';

interface LeaveFormData {
  type: LeaveType;
  reason: string;
  startDate: string;
  endDate: string;
}

interface EditLeaveModalProps {
  visible: boolean;
  onClose: () => void;
  onSubmit: (data: LeaveFormData) => void;
  initialData: LeaveFormData;
}

const EditLeaveModal = ({
  visible,
  onClose,
  onSubmit,
  initialData,
}: EditLeaveModalProps) => {
  const [type, setType] = useState<LeaveType>(initialData.type);
  const [reason, setReason] = useState(initialData.reason);
  const [startDate, setStartDate] = useState(initialData.startDate);
  const [endDate, setEndDate] = useState(initialData.endDate);

  const handleSubmit = () => {
    onSubmit({
      type,
      reason,
      startDate,
      endDate,
    });
  };

  return (
    <Modal visible={visible} animationType="slide" transparent>
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Cập nhật đơn xin nghỉ</Text>
            <TouchableOpacity onPress={onClose}>
              <Icon name="close" size={metrics.ms(24)} color="#666" />
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.modalBody}>
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
          </ScrollView>

          <View style={styles.modalFooter}>
            <TouchableOpacity
              style={[styles.button, styles.cancelButton]}
              onPress={onClose}>
              <Text style={styles.cancelButtonText}>Huỷ</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.button, styles.submitButton]}
              onPress={handleSubmit}>
              <Text style={styles.submitButtonText}>Xác nhận</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
  },
  modalContent: {
    backgroundColor: '#fff',
    margin: metrics.s(16),
    borderRadius: metrics.s(12),
    maxHeight: '80%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: metrics.s(16),
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  modalTitle: {
    fontSize: metrics.ms(18),
    fontWeight: '600',
    color: '#2196F3',
  },
  modalBody: {
    padding: metrics.s(16),
  },
  modalFooter: {
    flexDirection: 'row',
    padding: metrics.s(16),
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
    gap: metrics.s(12),
  },
  typeContainer: {
    flexDirection: 'row',
    gap: metrics.s(12),
    marginBottom: metrics.vs(16),
  },
  typeButton: {
    flex: 1,
    padding: metrics.s(12),
    borderRadius: metrics.s(8),
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
  button: {
    flex: 1,
    padding: metrics.s(12),
    borderRadius: metrics.s(8),
    alignItems: 'center',
  },
  cancelButton: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#666',
  },
  submitButton: {
    backgroundColor: '#2196F3',
  },
  cancelButtonText: {
    color: '#666',
    fontSize: metrics.ms(16),
    fontWeight: '600',
  },
  submitButtonText: {
    color: '#fff',
    fontSize: metrics.ms(16),
    fontWeight: '600',
  },
});

export default EditLeaveModal;
