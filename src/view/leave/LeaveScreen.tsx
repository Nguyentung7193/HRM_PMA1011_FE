import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import metrics from '../../constants/metrics';

const LeaveScreen = () => {
  const leaveRequests = [
    { id: '1', type: 'Nghỉ phép', date: '10/06/2025', status: 'Chờ duyệt' },
    { id: '2', type: 'Nghỉ ốm', date: '05/06/2025', status: 'Đã duyệt' },
  ];

  const renderItem = ({ item }) => (
    <View style={styles.leaveItem}>
      <View style={styles.leaveInfo}>
        <Text style={styles.leaveType}>{item.type}</Text>
        <Text style={styles.leaveDate}>{item.date}</Text>
      </View>
      <Text style={[styles.leaveStatus, 
        { color: item.status === 'Đã duyệt' ? '#4CAF50' : '#FFC107' }]}>
        {item.status}
      </Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.addButton}>
        <Icon name="add-circle" size={metrics.ms(24)} color="#2196F3" />
        <Text style={styles.addButtonText}>Tạo đơn xin nghỉ</Text>
      </TouchableOpacity>
      
      <FlatList
        data={leaveRequests}
        renderItem={renderItem}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.listContainer}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: metrics.s(16),
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: metrics.s(12),
    backgroundColor: '#E3F2FD',
    borderRadius: metrics.ms(8),
    marginBottom: metrics.vs(16),
  },
  addButtonText: {
    marginLeft: metrics.s(8),
    color: '#2196F3',
    fontSize: metrics.ms(16),
    fontWeight: '500',
  },
  listContainer: {
    gap: metrics.vs(12),
  },
  leaveItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: metrics.s(16),
    backgroundColor: '#F5F5F5',
    borderRadius: metrics.ms(8),
  },
  leaveInfo: {
    gap: metrics.vs(4),
  },
  leaveType: {
    fontSize: metrics.ms(16),
    fontWeight: '500',
  },
  leaveDate: {
    fontSize: metrics.ms(14),
    color: '#666',
  },
  leaveStatus: {
    fontSize: metrics.ms(14),
    fontWeight: '500',
  },
});

export default LeaveScreen;