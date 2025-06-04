import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import metrics from '../../constants/metrics';

const AttendanceScreen = () => {
  const currentTime = new Date().toLocaleTimeString();
  
  return (
    <View style={styles.container}>
      <View style={styles.timeCard}>
        <Text style={styles.currentTime}>{currentTime}</Text>
        <Text style={styles.date}>
          {new Date().toLocaleDateString('vi-VN')}
        </Text>
      </View>

      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.checkButton}>
          <Icon name="finger-print" size={metrics.ms(32)} color="#fff" />
          <Text style={styles.buttonText}>Chấm công</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.historyContainer}>
        <Text style={styles.historyTitle}>Lịch sử chấm công hôm nay</Text>
        <View style={styles.historyItem}>
          <Icon name="enter-outline" size={metrics.ms(24)} color="#4CAF50" />
          <Text style={styles.historyText}>Vào ca: 08:00</Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: metrics.s(16),
  },
  timeCard: {
    alignItems: 'center',
    padding: metrics.s(20),
    backgroundColor: '#E3F2FD',
    borderRadius: metrics.ms(12),
    marginBottom: metrics.vs(24),
  },
  currentTime: {
    fontSize: metrics.ms(32),
    fontWeight: 'bold',
    color: '#2196F3',
  },
  date: {
    fontSize: metrics.ms(16),
    color: '#666',
    marginTop: metrics.vs(8),
  },
  buttonContainer: {
    alignItems: 'center',
    marginBottom: metrics.vs(24),
  },
  checkButton: {
    backgroundColor: '#2196F3',
    padding: metrics.s(20),
    borderRadius: metrics.ms(100),
    alignItems: 'center',
    width: metrics.s(150),
    height: metrics.s(150),
    justifyContent: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: metrics.ms(16),
    marginTop: metrics.vs(8),
  },
  historyContainer: {
    padding: metrics.s(16),
    backgroundColor: '#F5F5F5',
    borderRadius: metrics.ms(8),
  },
  historyTitle: {
    fontSize: metrics.ms(16),
    fontWeight: '500',
    marginBottom: metrics.vs(12),
  },
  historyItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: metrics.s(8),
  },
  historyText: {
    fontSize: metrics.ms(14),
    color: '#666',
  },
});

export default AttendanceScreen;