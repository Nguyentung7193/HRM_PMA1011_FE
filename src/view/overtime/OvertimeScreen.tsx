import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import metrics from '../../constants/metrics';

const OvertimeScreen = () => {
  const overtimeRequests = [
    { id: '1', date: '10/06/2025', hours: 2, status: 'Chờ duyệt' },
    { id: '2', date: '05/06/2025', hours: 3, status: 'Đã duyệt' },
  ];

  const renderItem = ({ item }) => (
    <View style={styles.otItem}>
      <View style={styles.otInfo}>
        <Text style={styles.otDate}>{item.date}</Text>
        <Text style={styles.otHours}>{item.hours} giờ</Text>
      </View>
      <Text style={[styles.otStatus, 
        { color: item.status === 'Đã duyệt' ? '#4CAF50' : '#FFC107' }]}>
        {item.status}
      </Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.addButton}>
        <Icon name="add-circle" size={metrics.ms(24)} color="#2196F3" />
        <Text style={styles.addButtonText}>Đăng ký OT</Text>
      </TouchableOpacity>

      <FlatList
        data={overtimeRequests}
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
  otItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: metrics.s(16),
    backgroundColor: '#F5F5F5',
    borderRadius: metrics.ms(8),
  },
  otInfo: {
    gap: metrics.vs(4),
  },
  otDate: {
    fontSize: metrics.ms(16),
    fontWeight: '500',
  },
  otHours: {
    fontSize: metrics.ms(14),
    color: '#666',
  },
  otStatus: {
    fontSize: metrics.ms(14),
    fontWeight: '500',
  },
});

export default OvertimeScreen;