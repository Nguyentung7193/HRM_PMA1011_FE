import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import metrics from '../constants/metrics';
import Icon from 'react-native-vector-icons/Ionicons';

const HomeHeader = () => {
  return (
    <View style={styles.header}>
      <View style={styles.userInfo}>
        <View style={styles.avatar}>
          <Icon name="person" size={metrics.ms(24)} color="#666" />
        </View>
        <View style={styles.userTexts}>
          <Text style={styles.userName}>Nguyễn Văn A</Text>
          <Text style={styles.userRole}>Nhân viên</Text>
        </View>
      </View>
      
      <TouchableOpacity style={styles.notificationButton}>
        <Icon name="notifications" size={metrics.ms(24)} color="#2196F3" />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: metrics.s(16),
    paddingVertical: metrics.vs(12),
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatar: {
    width: metrics.s(40),
    height: metrics.s(40),
    borderRadius: metrics.s(20),
    backgroundColor: '#f5f5f5',
    justifyContent: 'center',
    alignItems: 'center',
  },
  userTexts: {
    marginLeft: metrics.s(12),
  },
  userName: {
    fontSize: metrics.ms(16),
    fontWeight: '600',
    color: '#000',
  },
  userRole: {
    fontSize: metrics.ms(14),
    color: '#666',
  },
  notificationButton: {
    padding: metrics.s(8),
  },
});

export default HomeHeader;