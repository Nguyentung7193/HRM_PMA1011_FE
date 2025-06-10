/* eslint-disable react-hooks/exhaustive-deps */
import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  ScrollView,
  TextInput,
} from 'react-native';
import metrics from '../constants/metrics';
import Icon from 'react-native-vector-icons/Ionicons';

interface EditOTModalProps {
  visible: boolean;
  onClose: () => void;
  onSubmit: (data: {
    date: string;
    startTime: string;
    endTime: string;
    totalHours: number;
    reason: string;
    project: string;
    tasks: string;
  }) => void;
  initialData: {
    date: string;
    startTime: string;
    endTime: string;
    totalHours: number;
    reason: string;
    project: string;
    tasks: string;
  };
}

const EditOTModal = ({visible, onClose, onSubmit, initialData}: EditOTModalProps) => {
  const [date, setDate] = useState('');
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');
  const [totalHours, setTotalHours] = useState('');
  const [reason, setReason] = useState('');
  const [project, setProject] = useState('');
  const [tasks, setTasks] = useState('');

  // Update state when modal becomes visible or initialData changes
  useEffect(() => {
    if (visible && initialData) {
      console.log('Modal opened with data:', initialData); // Debug log
      setDate(initialData.date.split('T')[0]);
      setStartTime(initialData.startTime);
      setEndTime(initialData.endTime);
      setTotalHours(initialData.totalHours.toString());
      setReason(initialData.reason);
      setProject(initialData.project);
      setTasks(initialData.tasks);
    }
  }, [visible]); // Chỉ depend vào visible, không depend vào initialData

  const handleSubmit = () => {
    console.log('Submit pressed'); // Debug log
    onSubmit({
      date,
      startTime,
      endTime,
      totalHours: Number(totalHours),
      reason,
      project,
      tasks,
    });
  };

  const handleClose = () => {
    console.log('Modal closing'); // Debug log
    // Reset form when closing
    setDate('');
    setStartTime('');
    setEndTime('');
    setTotalHours('');
    setReason('');
    setProject('');
    setTasks('');
    onClose();
  };

  console.log('Modal render - visible:', visible); // Debug log

  return (
    <Modal 
      visible={visible} 
      animationType="none" 
      transparent={true}
      presentationStyle="overFullScreen"
      onRequestClose={handleClose}
    >
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Cập nhật báo cáo OT</Text>
            <TouchableOpacity onPress={handleClose}>
              <Icon name="close" size={metrics.ms(24)} color="#666" />
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.modalBody} showsVerticalScrollIndicator={false}>
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
              />
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.label}>Dự án</Text>
              <TextInput
                style={styles.input}
                value={project}
                onChangeText={setProject}
              />
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.label}>Công việc</Text>
              <TextInput
                style={styles.input}
                value={tasks}
                onChangeText={setTasks}
                multiline
                numberOfLines={2}
              />
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.label}>Lý do</Text>
              <TextInput
                style={styles.input}
                value={reason}
                onChangeText={setReason}
                multiline
                numberOfLines={2}
              />
            </View>
          </ScrollView>

          <View style={styles.modalFooter}>
            <TouchableOpacity
              style={[styles.button, styles.cancelButton]}
              onPress={handleClose}>
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
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 9999,
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
    color: '#000',
  },
  modalFooter: {
    flexDirection: 'row',
    padding: metrics.s(16),
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
    gap: metrics.s(12),
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

export default EditOTModal;