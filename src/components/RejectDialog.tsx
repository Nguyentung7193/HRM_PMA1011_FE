import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Modal,
  ActivityIndicator,
} from 'react-native';
import metrics from '../constants/metrics';

interface RejectDialogProps {
  visible: boolean;
  rejectReason: string;
  rejecting: boolean;
  onReasonChange: (reason: string) => void;
  onCancel: () => void;
  onConfirm: () => void;
}

const RejectDialog: React.FC<RejectDialogProps> = ({
  visible,
  rejectReason,
  rejecting,
  onReasonChange,
  onCancel,
  onConfirm,
}) => {
  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onCancel}>
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <Text style={styles.modalTitle}>Từ chối đơn xin nghỉ</Text>
          <TextInput
            style={styles.input}
            placeholder="Nhập lý do từ chối"
            value={rejectReason}
            onChangeText={onReasonChange}
            multiline
            numberOfLines={3}
            editable={!rejecting}
          />
          <View style={styles.modalButtons}>
            <TouchableOpacity
              style={[styles.modalButton, styles.cancelButton]}
              onPress={onCancel}
              disabled={rejecting}>
              <Text style={styles.cancelButtonText}>Hủy</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.modalButton, styles.confirmButton]}
              onPress={onConfirm}
              disabled={rejecting}>
              {rejecting ? (
                <ActivityIndicator size="small" color="#fff" />
              ) : (
                <Text style={styles.confirmButtonText}>Xác nhận</Text>
              )}
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderRadius: metrics.ms(12),
    padding: metrics.s(20),
    width: '80%',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  modalTitle: {
    fontSize: metrics.ms(18),
    fontWeight: '600',
    color: '#333',
    marginBottom: metrics.vs(16),
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: metrics.ms(8),
    padding: metrics.s(12),
    fontSize: metrics.ms(14),
    color: '#333',
    textAlignVertical: 'top',
    minHeight: metrics.vs(80),
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: metrics.vs(20),
    gap: metrics.s(12),
  },
  modalButton: {
    paddingHorizontal: metrics.s(16),
    paddingVertical: metrics.vs(8),
    borderRadius: metrics.ms(6),
  },
  cancelButton: {
    backgroundColor: '#f5f5f5',
  },
  confirmButton: {
    backgroundColor: '#F44336',
  },
  cancelButtonText: {
    color: '#666',
    fontSize: metrics.ms(14),
    fontWeight: '500',
  },
  confirmButtonText: {
    color: '#fff',
    fontSize: metrics.ms(14),
    fontWeight: '500',
  },
});

export default RejectDialog;